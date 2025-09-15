// backend/src/controllers/quote.controller.js
import { createQuoteDB } from "../models/quote.model.js";
// Si tienes util para email, descomenta esto y el bloque más abajo:
// import { sendEmail } from "../utils/sendEmail.js";

export const createQuote = async (req, res) => {
  try {
    const { user_id, name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Si viene archivo (multer)
    let attachment_url = null;
    let attachment_mime = null;
    if (req.file) {
      const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";
      attachment_url = `${baseUrl}/uploads/quotes/${req.file.filename}`;
      attachment_mime = req.file.mimetype;
    }

    // Guarda la cotización en BD usando tu modelo existente
    const quote = await createQuoteDB({
      user_id: user_id || null,
      name,
      email,
      phone,
      message,
      attachment_url,
      attachment_mime,
    });

    // (Opcional) Enviar correo con link al adjunto
    /*
    try {
      await sendEmail({
        subject: `Nueva cotización de ${name}`,
        html: `
          <h2>Detalles de la cotización</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || "No especificado"}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${(message || "").replace(/\n/g, "<br/>")}</p>
          ${attachment_url ? `<p><strong>Imagen:</strong> <a href="${attachment_url}">${attachment_url}</a></p>` : "<p><i>Sin imagen adjunta</i></p>"}
          <hr/>
          <p>Enviado desde el formulario</p>
        `,
      });
    } catch (mailErr) {
      console.error("No se pudo enviar el correo de cotización:", mailErr);
    }
    */

    return res.status(201).json({ ok: true, message: "Cotización creada", quote });
  } catch (error) {
    console.error("Error creando cotización:", error);
    return res.status(500).json({ ok: false, error: "Error al crear cotización" });
  }
};
