import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config/api";

export default function CheckoutPage() {
  const { cart, total, totalItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    shipping_address: "",
    phone: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      setError("Tu carrito está vacío");
      return;
    }

    if (!formData.shipping_address.trim()) {
      setError("La dirección de envío es obligatoria");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Iniciando pago con Webpay...");
      console.log("Datos a enviar:", {
        items: cart,
        shipping_address: formData.shipping_address,
        phone: formData.phone,
        notes: formData.notes,
        total: total
      });

      // Crear la orden en el backend
      const orderResponse = await fetch(`${API_URL}/webpay/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          items: cart,
          shipping_address: formData.shipping_address,
          phone: formData.phone,
          notes: formData.notes,
          total: total
        })
      });

      console.log("Status de respuesta:", orderResponse.status);
      
      const orderData = await orderResponse.json();
      console.log("Respuesta del backend:", orderData);

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Error al crear la orden");
      }

      // Verificar que tenemos la URL antes de redirigir
      if (orderData.url && orderData.token) {
        console.log("Redirigiendo a Webpay:", orderData.url);
        // Redirigir a Webpay
        window.location.href = orderData.url;
      } else {
        console.error("Respuesta incompleta:", orderData);
        throw new Error("No se recibió URL de Webpay válida");
      }
      
    } catch (err: any) {
      console.error("Error completo:", err);
      setError(err.message || "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/login", { state: { from: "/checkout" } });
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Carrito vacío</h1>
          <p className="text-gray-600 mb-6">No tienes productos en tu carrito.</p>
          <button
            onClick={() => navigate("/productos")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Formulario de datos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Datos de envío</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de envío *
                </label>
                <input
                  type="text"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Av. Las Condes 123, Las Condes, Santiago"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de contacto
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instrucciones especiales para el bordado..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Procesando..." : "Pagar con Webpay"}
              </button>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumen del pedido</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ${Number(item.price).toLocaleString("es-CL")} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ${(Number(item.price) * item.quantity).toLocaleString("es-CL")}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal ({totalItems} productos)</span>
                <span className="text-gray-800">${total.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toLocaleString("es-CL")}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">Pago seguro con Webpay</span>
              </div>
              <p className="text-xs text-blue-600">
                Transacción protegida por Transbank. Acepta tarjetas de crédito y débito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}