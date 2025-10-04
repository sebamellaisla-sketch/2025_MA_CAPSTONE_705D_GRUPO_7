import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { submitQuoteRequest } from '../controllers/contactController.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '../../..', 'uploads', 'quote-attachments')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext)
    const sanitized = base.replace(/[^a-zA-Z0-9_-]/g, '_')
    cb(null, `${sanitized}_${timestamp}${ext}`)
  }
})

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp).'))
  }
}

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 5)

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeMb * 1024 * 1024,
    files: 5
  }
})

router.post('/quote', upload.array('attachments', 5), submitQuoteRequest)

export default router
