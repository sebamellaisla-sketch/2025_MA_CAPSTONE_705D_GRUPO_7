import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import pool, { query } from '../config/database.js'
import logger from '../config/logger.js'
import { AppError, catchAsync } from '../middleware/errorHandler.js'
import { sendQuoteRequestEmail } from '../services/emailService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsRoot = path.resolve(__dirname, '../../..', 'uploads')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const cleanupFiles = async (files = []) => {
  await Promise.allSettled(files.map(async (file) => {
    if (!file?.path) return
    try {
      await fs.unlink(file.path)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.warn('No se pudo eliminar archivo tras fallo en cotización', {
          file: file.path,
          error: error.message
        })
      }
    }
  }))
}

export const submitQuoteRequest = catchAsync(async (req, res) => {
  const { name, email, phone, message } = req.body
  const attachments = req.files || []

  if (!name || !email || !message) {
    await cleanupFiles(attachments)
    throw new AppError('Los campos nombre, email y mensaje son obligatorios.', 400)
  }

  if (!EMAIL_REGEX.test(email)) {
    await cleanupFiles(attachments)
    throw new AppError('Formato de email inválido.', 400)
  }

  if (attachments.length > 5) {
    await cleanupFiles(attachments)
    throw new AppError('Máximo permitido: 5 imágenes adjuntas.', 400)
  }

  const client = await pool.connect()
  let quoteRow
  const storedAttachments = []

  try {
    await client.query('BEGIN')

    const quoteResult = await client.query(
      `INSERT INTO quotes (user_id, name, email, phone, message, status, source, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, user_id, name, email, phone, message, status, source, created_at, updated_at`,
      [req.user?.id || null, name, email, phone || null, message, 'pendiente', 'contact_form']
    )

    quoteRow = quoteResult.rows[0]

    if (attachments.length > 0) {
      for (const file of attachments) {
        const relativePath = path.relative(uploadsRoot, file.path).replace(/\\/g, '/')
        const attachmentResult = await client.query(
          `INSERT INTO quote_attachments (quote_id, file_name, original_name, file_path, mime_type, file_size)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, quote_id, file_name, original_name, file_path, mime_type, file_size, uploaded_at`,
          [quoteRow.id, file.filename, file.originalname, relativePath, file.mimetype, file.size]
        )

        const saved = attachmentResult.rows[0]
        storedAttachments.push({
          ...saved,
          url: `/${saved.file_path}`
        })
      }
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    await cleanupFiles(attachments)
    logger.error('Error guardando solicitud de cotización', {
      error: error.message
    })
    throw error
  } finally {
    client.release()
  }

  const emailResult = await sendQuoteRequestEmail({
    quote: quoteRow,
    attachments
  })

  if (emailResult?.error) {
    logger.warn('La solicitud se guardó pero el email falló', {
      quoteId: quoteRow.id,
      error: emailResult.error.message
    })
  }

  res.status(201).json({
    success: true,
    message: 'Tu solicitud de cotización fue enviada exitosamente.',
    data: {
      ...quoteRow,
      attachments: storedAttachments
    },
    email: {
      sent: Boolean(emailResult?.sent),
      skipped: Boolean(emailResult?.skipped),
      messageId: emailResult?.messageId || null
    }
  })
})

export const getQuoteRequestById = catchAsync(async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    throw new AppError('El identificador proporcionado es inválido.', 400)
  }

  const quoteResult = await query(
    `SELECT id, user_id, name, email, phone, message, status, source, created_at, updated_at
     FROM quotes WHERE id = $1`,
    [id]
  )

  if (quoteResult.rows.length === 0) {
    throw new AppError('No se encontró la solicitud solicitada.', 404)
  }

  const attachmentsResult = await query(
    `SELECT id, quote_id, file_name, original_name, file_path, mime_type, file_size, uploaded_at
     FROM quote_attachments WHERE quote_id = $1 ORDER BY uploaded_at ASC`,
    [id]
  )

  res.json({
    success: true,
    data: {
      ...quoteResult.rows[0],
      attachments: attachmentsResult.rows.map((attachment) => ({
        ...attachment,
        url: `/${attachment.file_path}`
      }))
    }
  })
})
