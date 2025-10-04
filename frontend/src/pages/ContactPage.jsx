import { useState } from 'react'
import { submitQuoteRequest } from '../services/contactService'

const MAX_ATTACHMENTS = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  message: ''
}

const ContactPage = () => {
  const [formValues, setFormValues] = useState(initialFormState)
  const [files, setFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const incomingFiles = Array.from(event.target.files || [])
    const combined = [...files, ...incomingFiles]

    if (combined.length > MAX_ATTACHMENTS) {
      setError(`Solo puedes adjuntar hasta ${MAX_ATTACHMENTS} imágenes.`)
      return
    }

    const invalidFile = combined.find((file) => !file.type.startsWith('image/'))
    if (invalidFile) {
      setError('Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP).')
      return
    }

    const oversizeFile = combined.find((file) => file.size > MAX_FILE_SIZE)
    if (oversizeFile) {
      setError('Cada imagen debe pesar máximo 5MB.')
      return
    }

    setError(null)
    setFiles(combined)
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index))
  }

  const resetForm = () => {
    setFormValues(initialFormState)
    setFiles([])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!formValues.name.trim() || !formValues.email.trim() || !formValues.message.trim()) {
      setError('Los campos Nombre, Email y Mensaje son obligatorios.')
      return
    }

    const formData = new FormData()
    formData.append('name', formValues.name.trim())
    formData.append('email', formValues.email.trim())
    formData.append('phone', formValues.phone.trim())
    formData.append('message', formValues.message.trim())

    files.forEach((file) => {
      formData.append('attachments', file)
    })

    try {
      setIsSubmitting(true)
      const response = await submitQuoteRequest(formData)
      setSuccess(response?.message || 'Solicitud enviada con éxito.')
      resetForm()
    } catch (submitError) {
      setError(submitError.message || 'Ocurrió un error al enviar la solicitud.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:pt-32">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Solicita tu Cotización</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Cuéntanos sobre tu proyecto de bordado y nuestro equipo se pondrá en contacto contigo para entregar una propuesta personalizada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-neutral-900/70 border border-neutral-700/60 rounded-2xl p-6 shadow-lg backdrop-blur">
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                Nombre completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Ej: Francisca Pérez"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Correo electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="nombre@empresa.cl"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
                Teléfono de contacto
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formValues.phone}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60 transition"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                Detalles del proyecto *
              </label>
              <textarea
                id="message"
                name="message"
                value={formValues.message}
                onChange={handleChange}
                rows={6}
                placeholder="Cuéntanos qué necesitas, cantidades, fechas estimadas y cualquier detalle importante."
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60 transition resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Adjuntar imágenes de referencia (opcional)
              </label>
              <div className="rounded-2xl border border-dashed border-amber-400/60 bg-neutral-900/60 p-5 text-center">
                <input
                  id="attachments"
                  name="attachments"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="attachments"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
                >
                  Seleccionar imágenes
                </label>
                <p className="mt-3 text-xs text-gray-400">
                  Hasta {MAX_ATTACHMENTS} archivos JPG, PNG, GIF o WEBP (máximo 5MB cada uno).
                </p>

                {files.length > 0 && (
                  <ul className="mt-4 space-y-2 text-left text-sm text-gray-200">
                    {files.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-lg bg-neutral-800 px-3 py-2"
                      >
                        <span className="truncate pr-2">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-xs font-semibold text-red-400 hover:text-red-300"
                        >
                          Quitar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-base font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-400/60"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-neutral-900/60 border border-neutral-700/60 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-3">¿Cómo funciona?</h2>
            <ol className="space-y-3 text-sm text-gray-300">
              <li><strong>1.</strong> Completa el formulario con los detalles de tu proyecto.</li>
              <li><strong>2.</strong> Adjunta imágenes de referencia si tienes.</li>
              <li><strong>3.</strong> Nuestro equipo revisa y te responde en menos de 24 horas hábiles.</li>
            </ol>
          </div>

          <div className="rounded-2xl bg-neutral-900/60 border border-neutral-700/60 p-6 backdrop-blur">
            <h3 className="text-xl font-semibold text-white mb-3">Información de contacto</h3>
            <p className="text-gray-300 mb-2">📧 <a href="mailto:cotizaciones@testheb.cl" className="text-amber-300 hover:underline">cotizaciones@testheb.cl</a></p>
            <p className="text-gray-300 mb-4">📱 +56 9 1234 5678</p>
            <p className="text-sm text-gray-400">
              También puedes escribirnos por WhatsApp o Instagram si prefieres un canal directo.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-900/60 border border-neutral-700/60 p-6 backdrop-blur">
            <h3 className="text-xl font-semibold text-white mb-3">¿Qué nos ayuda a cotizar mejor?</h3>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
              <li>Tipo de prenda o soporte para el bordado.</li>
              <li>Cantidad estimada de unidades.</li>
              <li>Medidas aproximadas del diseño.</li>
              <li>Fecha límite o evento asociado.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ContactPage
