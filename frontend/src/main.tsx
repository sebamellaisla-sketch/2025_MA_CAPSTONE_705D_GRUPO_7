import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App";
import CategoriaPage from "./pages/CategoriaPage";
import CotizacionPage from "./pages/CotizacionPage";
import { AuthProvider } from "./context/AuthContext";

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/categorias/:categoriaId" element={<CategoriaPage />} />
          <Route path="/cotiza" element={<CotizacionPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);