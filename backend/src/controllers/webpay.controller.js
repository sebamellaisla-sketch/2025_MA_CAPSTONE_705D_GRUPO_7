import pkg from "transbank-sdk";
const { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = pkg;

// Configurar Webpay para ambiente de integración (sandbox)
const tx = new WebpayPlus.Transaction(new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  Environment.Integration
));

export const createTransaction = async (req, res) => {
  console.log("🔥 WEBPAY CREATE LLAMADO");

  try {
    const { items, shipping_address, phone, notes, total } = req.body;
    const user_id = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    if (!shipping_address) {
      return res.status(400).json({ error: "La dirección de envío es obligatoria" });
    }

    const buyOrder = `ORDER_${Date.now()}_${user_id}`;
    const sessionId = `SESSION_${Date.now()}_${user_id}`;
    const amount = Math.round(total);
    const returnUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/webpay/result`;

    console.log("Parámetros:", { buyOrder, sessionId, amount, returnUrl });
    
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    
    console.log("Respuesta Webpay:", response);
    
    res.json({
      token: response.token,
      url: response.url,
      buyOrder: buyOrder
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};

export const confirmTransaction = async (req, res) => {
  console.log("🔥 WEBPAY CONFIRM LLAMADO");

  try {
    const { token_ws } = req.body;

    if (!token_ws) {
      return res.status(400).json({ error: "Token de transacción requerido" });
    }

    const response = await tx.commit(token_ws);
    
    console.log("Respuesta de confirmación:", response);

    if (response.status === "AUTHORIZED") {
      res.json({
        status: "success",
        transaction: response
      });
    } else {
      res.json({
        status: "failed",
        transaction: response
      });
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al confirmar transacción" });
  }
};

export const getTransactionStatus = async (req, res) => {
  try {
    const { token } = req.params;
    const response = await tx.status(token);
    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al obtener estado" });
  }
};