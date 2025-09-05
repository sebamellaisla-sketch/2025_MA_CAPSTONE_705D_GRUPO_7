import { useState } from "react";
import { API_URL } from "../config/api";
import { postRedirect } from "../utils/postRedirect";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_URL}/webpay/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Puedes enviar buyOrder, sessionId, amount personalizados si quieres
          // buyOrder, sessionId, amount
        }),
      });

      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j?.error || "No se pudo crear la transacción");
      }

      const { url, token } = (await resp.json()) as {
        url: string;
        token: string;
      };

      if (!url || !token) throw new Error("Respuesta inválida de Webpay");

      // CLAVE: Webpay espera POST con token_ws
      postRedirect(url, { token_ws: token });
    } catch (e: any) {
      setError(e.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Tu contenido de carrito/dirección/monto... */}

      <button
        onClick={handlePay}
        disabled={loading}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
      >
        {loading ? "Redirigiendo a Webpay..." : "Pagar con Webpay"}
      </button>

      {error && (
        <p className="mt-3 text-red-600">
          {error}
        </p>
      )}
    </main>
  );
}
