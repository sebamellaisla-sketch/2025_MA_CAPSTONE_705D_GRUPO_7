import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CategoriaPage from "./pages/CategoriaPage";
import CotizacionPage from "./pages/CotizacionPage";
import AdminPanel from "./pages/AdminPanel";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/categorias" element={<CategoriaPage />} />
            <Route path="/cotiza" element={<CotizacionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/productos" element={<ProductPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);