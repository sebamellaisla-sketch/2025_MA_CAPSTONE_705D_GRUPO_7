import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { API_URL } from "../config/api";

type TransactionResult = {
  status: "success" | "failed" | "loading" | "error";
  transaction?: any;
  message?: string;
};

export default function WebpayResultPage() {
  const [result, setResult] = useState<TransactionResult>({ status: "loading" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const processTransaction = async () => {
      try {
        // Obtener parámetros de Webpay
        const token_ws = searchParams.get("token_ws");
        const TBK_TOKEN = searchParams.get("TBK_TOKEN");
        const TBK_ORDEN_COMPRA = searchParams.get("TBK_ORDEN_COMPRA");
        const TBK_ID_SESION = searchParams.get("TBK_ID_SESION");

        // Si hay TBK_TOKEN, significa que la transacción fue cancelada/rechazada
        if (TBK_TOKEN) {
          setResult({
            status: "failed",
            message: "La transacción fue cancelada o rechazada."
          });
          return;
        }

        // Si no hay token_ws, algo salió mal
        if (!token_ws) {
          setResult({
            status: "error",
            message: "No se recibió información de la transacción."
          });
          return;
        }

        // Confirmar transacción con nuestro backend
        const response = await fetch(`${API_URL}/webpay/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token_ws })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al confirmar transacción");
        }

        if (data.status === "success") {
          // Transacción exitosa
          setResult({
            status: "success",
            transaction: data.transaction,
            message: "¡Pago realizado exitosamente!"
          });
          
          // Limpiar carrito después de pago exitoso
          clearCart();
        } else {
          // Transacción falló
          setResult({
            status: "failed",
            transaction: data.transaction,
            message: "El pago no pudo ser procesado."
          });
        }

      } catch (error: any) {
        console.error("Error procesando transacción:", error);
        setResult({
          status: "error",
          message: error.message || "Error al procesar la transacción"
        });
      }
    };

    processTransaction();
  }, [searchParams, clearCart]);

  const getStatusIcon = () => {
    switch (result.status) {
      case "success":
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "failed":
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "loading":
        return (
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case "success": return "text-green-800";
      case "failed": return "text-red-800";
      case "loading": return "text-blue-800";
      default: return "text-yellow-800";
    }
  };

  const getTitle = () => {
    switch (result.status) {
      case "success": return "¡Pago Exitoso!";
      case "failed": return "Pago Rechazado";
      case "loading": return "Procesando...";
      default: return "Error en el Pago";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        
        {getStatusIcon()}
        
        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {getTitle()}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {result.message}
        </p>

        {/* Detalles de la transacción exitosa */}
        {result.status === "success" && result.transaction && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Detalles de la transacción:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Orden:</span> {result.transaction.buy_order}</p>
              <p><span className="font-medium">Monto:</span> ${result.transaction.amount?.toLocaleString("es-CL")}</p>
              <p><span className="font-medium">Autorización:</span> {result.transaction.authorization_code}</p>
              <p><span className="font-medium">Tarjeta:</span> ****{result.transaction.card_detail?.card_number}</p>
            </div>
          </div>
        )}

        {/* Detalles del error/rechazo */}
        {result.status === "failed" && result.transaction && (
          <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-800 mb-2">Información del rechazo:</h3>
            <div className="space-y-1 text-sm text-red-600">
              <p><span className="font-medium">Código:</span> {result.transaction.response_code}</p>
              {result.transaction.buy_order && (
                <p><span className="font-medium">Orden:</span> {result.transaction.buy_order}</p>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-3">
          {result.status === "success" && (
            <>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Volver al inicio
              </button>
              <button
                onClick={() => navigate("/productos")}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Seguir comprando
              </button>
            </>
          )}

          {result.status === "failed" && (
            <>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => navigate("/productos")}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Volver a productos
              </button>
            </>
          )}

          {result.status === "error" && (
            <>
              <button
                onClick={() => navigate("/productos")}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Volver a productos
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Ir al inicio
              </button>
            </>
          )}

          {result.status === "loading" && (
            <p className="text-sm text-gray-500">
              Por favor espera mientras procesamos tu pago...
            </p>
          )}
        </div>

        {/* Información de contacto */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            ¿Necesitas ayuda? Contáctanos al +56 9 3379 7489
          </p>
        </div>
      </div>
    </div>
  );
}
