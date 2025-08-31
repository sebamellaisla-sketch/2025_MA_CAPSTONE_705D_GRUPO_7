import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import CategoriaPage from './pages/CategoriaPage.tsx' // página de detalle

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<App />} />
        {/* Ruta dinámica para categorías */}
        <Route path="/categorias/:categoriaId" element={<CategoriaPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
