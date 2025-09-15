// backend/src/controllers/webpay.controller.js
import pkg from "transbank-sdk";
import {
  createOrder,
  updateOrderOnCommit,
  markOrderAborted,
} from "../models/order.model.js";

const {
  WebpayPlus,
  Options,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Environment,
} = pkg;

/* =========================
 * Helpers
 * ========================= */

function buildTx() {
  const env = (process.env.WEBPAY_ENVIRONMENT || "integration").toLowerCase();

  if (env === "integration") {
    return new WebpayPlus.Transaction(
      new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
      )
    );
  }

  // Producción
  const code = process.env.TBK_COMMERCE_CODE;
  const apiKey = process.env.TBK_API_KEY;
  if (!code || !apiKey) {
    throw new Error("Faltan TBK_COMMERCE_CODE / TBK_API_KEY para producción");
  }
  return new WebpayPlus.Transaction(
    new Options(code, apiKey, Environment.Production)
  );
}

const tx = buildTx();

/** Normaliza CLP a entero (acepta 19990 o "19.990"/"19,990") */
function sanitizeCLP(input) {
  const s = typeof input === "string" ? input.replace(/[^\d]/g, "") : input;
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

/* =========================
 * Controllers
 * ========================= */

/**
 * POST /api/webpay/create
 * Body: { amount: number|string, items?: any[], shipping?: { ... } }
 */
export const createTransaction = async (req, res) => {
  try {
    const buyOrder = `O-${Date.now()}`;
    const sessionId = `S-${Date.now()}`;
    const amount = sanitizeCLP(req.body?.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const shipping = {
      address: req.body?.shipping?.address ?? req.body?.shipping_address ?? "N/A",
      city: req.body?.shipping?.city ?? "",
      region: req.body?.shipping?.region ?? "",
      zip: req.body?.shipping?.zip ?? "",
      name: req.body?.customer?.name ?? req.body?.name ?? "",
      email: req.body?.customer?.email ?? req.body?.email ?? "",
      phone: req.body?.customer?.phone ?? req.body?.phone ?? "",
      notes: req.body?.notes ?? "",
    };

    // Guardar orden en estado "created" (si falla, no cortamos el flujo)
    try {
      await createOrder({
        buyOrder,
        sessionId,
        amount,
        userId: req.user?.id || null,
        items,
        shipping,
      });
    } catch (e) {
      console.error("createOrder falló, continúo sin persistir:", e);
    }

    // URL de retorno DEL BACKEND (POST desde Webpay)
    const returnUrl = `${process.env.BACKEND_URL}/api/webpay/commit`;

    const r = await tx.create(buyOrder, sessionId, amount, returnUrl);
    return res.json({ token: r.token, url: r.url, buyOrder, amount });
  } catch (err) {
    console.error("WEBPAY CREATE ERROR", err);
    return res
      .status(500)
      .json({ error: "No se pudo crear la transacción Webpay" });
  }
};

/**
 * POST/GET /api/webpay/commit
 * - éxito:  token_ws
 * - cancel: TBK_TOKEN + TBK_ORDEN_COMPRA
 * (Soportamos GET para refresh o si el usuario vuelve a la URL)
 */
export const commitTransaction = async (req, res) => {
  try {
    const isGet = req.method === "GET";
    const token_ws = isGet ? req.query?.token_ws : req.body?.token_ws;
    const TBK_TOKEN = isGet ? req.query?.TBK_TOKEN : req.body?.TBK_TOKEN;
    const TBK_ORDEN_COMPRA = isGet
      ? req.query?.TBK_ORDEN_COMPRA
      : req.body?.TBK_ORDEN_COMPRA;

    // Usuario canceló en Webpay
    if (TBK_TOKEN) {
      try {
        if (TBK_ORDEN_COMPRA) {
          await markOrderAborted({ buyOrder: TBK_ORDEN_COMPRA });
        }
      } catch (e) {
        console.error("markOrderAborted falló:", e);
      }
      const abortedQs = new URLSearchParams({
        status: "aborted",
        buyOrder: TBK_ORDEN_COMPRA || "",
      }).toString();
      return res.redirect(
        302,
        `${process.env.FRONTEND_URL}/webpay/result?${abortedQs}`
      );
    }

    if (!token_ws) {
      // Si llega GET sin token (por abrir la URL a mano), redirige al front
      return res.redirect(
        302,
        `${process.env.FRONTEND_URL}/webpay/result?status=error`
      );
    }

    const result = await tx.commit(token_ws);

    // Persistir resultado (si falla, no cortamos redirección)
    try {
      await updateOrderOnCommit({
        buyOrder: result.buy_order,
        result,
        token_ws,
      });
    } catch (e) {
      console.error("updateOrderOnCommit falló:", e);
    }

    const qs = new URLSearchParams({
      status: String(result.status ?? ""),
      buyOrder: String(result.buy_order ?? ""),
      amount: String(result.amount ?? ""),
      authorizationCode: String(result.authorization_code ?? ""),
      paymentType: String(result.payment_type_code ?? ""),
      responseCode: String(result.response_code ?? ""),
      cardNumber: String(result.card_detail?.card_number ?? ""),
      installmentsNumber: String(result.installments_number ?? ""),
    }).toString();

    return res.redirect(
      302,
      `${process.env.FRONTEND_URL}/webpay/result?${qs}`
    );
  } catch (err) {
    console.error("WEBPAY COMMIT ERROR", err);
    return res.redirect(
      302,
      `${process.env.FRONTEND_URL}/webpay/result?status=error`
    );
  }
};
