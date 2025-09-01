import { createQuoteDB } from "../models/quote.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createQuote = async (req, res) => {
  try {
    const { user_id, name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const quote = await createQuoteDB({ user_id, name, email, phone, message });

    // Enviar correo al admin
    await sendEmail({
      subject: `Nueva cotización de ${name}`,
      html: `
        <h2>Detalles de la cotización</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || "No especificado"}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
        <hr/>
        <p>Enviado desde el formulario de Testheb</p>
      `
    });

    res.status(201).json({ message: "Cotización creada y correo enviado", quote });
  } catch (error) {
    console.error("Error al crear cotización:", error);
    res.status(500).json({ error: "Error al crear cotización" });
  }
};