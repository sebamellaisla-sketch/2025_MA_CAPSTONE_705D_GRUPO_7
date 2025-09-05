import pkg from "transbank-sdk";
const {
  WebpayPlus,
  Options,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Environment,
} = pkg;

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

export const createTransaction = async (req, res) => {
  try {
    // Datos mínimos de ejemplo
    const buyOrder = `O-${Date.now()}`;
    const sessionId = `S-${Date.now()}`;
    const amount = 12345; // CLP entero

    // IMPORTANTE: returnUrl debe ser del BACKEND
    const returnUrl = `${process.env.BACKEND_URL}/api/webpay/commit`;

    const r = await tx.create(buyOrder, sessionId, amount, returnUrl);
    // r: { token, url }
    return res.json({ token: r.token, url: r.url, buyOrder });
  } catch (err) {
    console.error("WEBPAY CREATE ERROR", err);
    return res
      .status(500)
      .json({ error: "No se pudo crear la transacción Webpay" });
  }
};

export const commitTransaction = async (req, res) => {
  try {
    // Webpay POSTea aquí:
    // - éxito: token_ws
    // - cancelada: TBK_TOKEN + TBK_ORDEN_COMPRA
    const { token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA } = req.body;

    if (TBK_TOKEN) {
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
      return res.status(400).send("Falta token_ws");
    }

    const result = await tx.commit(token_ws);

    // Envía al front lo necesario para mostrar el resultado
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
