const API_BASE_URL = '/api'

export const submitQuoteRequest = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/contact/quote`, {
    method: 'POST',
    body: formData
  })

  let data = null
  try {
    data = await response.json()
  } catch (error) {
    // Ignorar si no es JSON
  }

  if (!response.ok) {
    const message = data?.message || 'No se pudo enviar la solicitud de cotización.'
    const error = new Error(message)
    error.details = data
    throw error
  }

  return data
}
