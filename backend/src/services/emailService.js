import nodemailer from 'nodemailer'
import logger from '../config/logger.js'
import { emailConfig } from '../config/email.js'

// Crear transportador de email reutilizable
let transporter

const createTransporter = () => {
  try {
    const instance = nodemailer.createTransport(emailConfig)

    if (typeof instance.verify === 'function') {
      instance.verify((error) => {
        if (error) {
          logger.error('Error en configuración de email:', error)
        } else {
          logger.info('✓ Servidor de email configurado correctamente')
        }
      })
    }

    return instance
  } catch (error) {
    logger.error('Error creando transportador de email:', error)
    return null
  }
}

transporter = createTransporter()

const ensureTransporter = () => {
  if (transporter) return true
  transporter = createTransporter()
  return Boolean(transporter)
}

/**
 * Enviar email de recuperación de contraseña
 */
export const sendPasswordResetEmail = async ({ to, name, resetToken }) => {
  try {
    if (!ensureTransporter()) {
      logger.error('Transportador de email no disponible')
      return {
        success: false,
        error: 'Servicio de email no configurado'
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'TESTheb',
        address: process.env.EMAIL_USER
      },
      to,
      subject: 'Recuperación de Contraseña - TESTheb',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperación de Contraseña</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 8px 8px 0 0; color: #ffffff;">
                      <h1 style="margin: 0; color: #fbbf24;">🧵 TESTheb</h1>
                      <p style="margin: 10px 0 0 0;">Bordados Personalizados</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px; color: #1f2937; text-align: left;">
                      <h2 style="margin-top: 0;">Recuperación de Contraseña</h2>
                      <p>Hola <strong>${name}</strong>,</p>
                      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en TESTheb.</p>
                      <p>Haz clic en el siguiente botón para crear una nueva contraseña. El enlace expira en 1 hora.</p>
                      <p style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 16px 36px; background-color: #fbbf24; color: #1a1a1a; text-decoration: none; font-weight: 600; border-radius: 6px;">Restablecer Contraseña</a>
                      </p>
                      <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo. Tu clave actual seguirá siendo válida.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center; color: #6b7280; font-size: 12px;">
                      <p style="margin: 0 0 8px 0;">Este es un correo automático, por favor no respondas a este mensaje.</p>
                      <p style="margin: 0;">© ${new Date().getFullYear()} TESTheb - Bordados Personalizados</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `Hola ${name},\n\nRecibimos una solicitud para restablecer la contraseña de tu cuenta en TESTheb.\n\nVisita el siguiente enlace (válido por 1 hora):\n${resetUrl}\n\nSi no solicitaste restablecer tu contraseña, ignora este correo.\n\nSaludos,\nEl equipo de TESTheb`
    }

    const info = await transporter.sendMail(mailOptions)

    logger.info('Email de recuperación enviado exitosamente', {
      to,
      messageId: info.messageId
    })

    return {
      success: true,
      messageId: info.messageId
    }
  } catch (error) {
    logger.error('Error enviando email de recuperación:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Enviar email de bienvenida (opcional)
 */
export const sendWelcomeEmail = async ({ to, name }) => {
  try {
    if (!ensureTransporter()) {
      return { success: false, error: 'Servicio de email no configurado' }
    }

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'TESTheb',
        address: process.env.EMAIL_USER
      },
      to,
      subject: '¡Bienvenido a TESTheb! 🧵',
      html: `
        <h2>¡Bienvenido ${name}!</h2>
        <p>Gracias por registrarte en TESTheb.</p>
        <p>Estamos emocionados de tenerte con nosotros.</p>
        <p>Explora nuestro catálogo y crea bordados únicos y personalizados.</p>
        <p>Saludos,<br>El equipo de TESTheb</p>
      `,
      text: `¡Bienvenido ${name}!\n\nGracias por registrarte en TESTheb. Estamos emocionados de tenerte con nosotros.\n\nSaludos,\nEl equipo de TESTheb`
    }

    const info = await transporter.sendMail(mailOptions)
    logger.info('Email de bienvenida enviado', { to, messageId: info.messageId })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    logger.error('Error enviando email de bienvenida:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Enviar email al administrador con la solicitud de cotización
 */
export const sendQuoteRequestEmail = async ({ quote, attachments = [] }) => {
  try {
    if (!ensureTransporter()) {
      logger.warn('Transportador de email no disponible para solicitudes de cotización')
      return { sent: false, skipped: true }
    }

    const recipients = process.env.QUOTE_NOTIFICATION_EMAIL || process.env.EMAIL_ADMIN || process.env.EMAIL_USER

    if (!recipients) {
      logger.warn('No hay destinatario configurado para notificaciones de cotización.')
      return { sent: false, skipped: true }
    }

    const files = (attachments || []).filter(Boolean).map((file) => ({
      filename: file.originalname || file.file_name,
      path: file.path || file.file_path,
      contentType: file.mimetype || file.mime_type
    }))

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'TESTheb',
        address: process.env.EMAIL_USER
      },
      to: recipients,
      subject: `Nueva solicitud de cotización #${quote?.id ?? ''}`.trim(),
      html: `
        <h2>Nueva solicitud de cotización</h2>
        <p>Se registró una nueva solicitud desde el formulario de contacto.</p>
        <ul>
          <li><strong>Nombre:</strong> ${quote?.name}</li>
          <li><strong>Email:</strong> ${quote?.email}</li>
          <li><strong>Teléfono:</strong> ${quote?.phone || 'No indicado'}</li>
          <li><strong>Fecha:</strong> ${quote?.created_at}</li>
          <li><strong>Origen:</strong> ${quote?.source || 'contact_form'}</li>
        </ul>
        <h3>Mensaje</h3>
        <pre style="background:#f4f4f4;padding:12px;border-radius:8px;white-space:pre-wrap;">${quote?.message}</pre>
        <p>Adjuntos: <strong>${files.length}</strong></p>
      `,
      text: `Nueva solicitud de cotización\n\nNombre: ${quote?.name}\nEmail: ${quote?.email}\nTeléfono: ${quote?.phone || 'No indicado'}\nFecha: ${quote?.created_at}\nOrigen: ${quote?.source || 'contact_form'}\n\nMensaje:\n${quote?.message}\n\nAdjuntos: ${files.length}`,
      attachments: files
    }

    const info = await transporter.sendMail(mailOptions)
    logger.info('Email de solicitud de cotización enviado', {
      to: recipients,
      quoteId: quote?.id,
      messageId: info.messageId
    })

    return { sent: true, messageId: info.messageId }
  } catch (error) {
    logger.error('Error enviando email de solicitud de cotización:', error)
    return { sent: false, error }
  }
}

export default {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendQuoteRequestEmail
}
