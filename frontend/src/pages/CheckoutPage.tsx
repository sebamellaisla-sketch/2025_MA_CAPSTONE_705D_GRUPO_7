// src/pages/CheckoutPage.tsx
import { useContext, useMemo, useState } from "react";
import { API_URL } from "../config/api";
import { postRedirect } from "../utils/postRedirect";
import { CartContext } from "../context/CartContext";

function formatCLP(n: number) {
  return n.toLocaleString("es-CL");
}

export default function CheckoutPage() {
  const { cart, total /*, clearCart*/ } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Total a CLP entero (Webpay espera entero sin decimales)
  const amount = useMemo(
    () => Math.max(0, Math.round(Number(total || 0))),
    [total]
  );

  // Normaliza ítems para enviarlos/guardar en backend (opcional pero útil)
  const items = useMemo(
    () =>
      cart.map((it) => ({
        id: it.id,
        name: it.name,
        price: Math.round(Number(it.price)), // CLP entero
        quantity: Number(it.quantity) || 1,
        subtotal: Math.round(Number(it.price)) * (Number(it.quantity) || 1),
      })),
    [cart]
  );

  const isCartEmpty = cart.length === 0 || amount <= 0;

  const handlePay = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isCartEmpty) {
        throw new Error("El carrito está vacío o el monto es inválido.");
      }

      // (opcional) si tienes formulario de despacho/cliente, arma este objeto con sus valores reales
      const shipping = {
        address: "N/A", // ← reemplaza cuando tengas formulario real
        city: "",
        region: "",
        zip: "",
        name: "",
        email: "",
        phone: "",
        notes: "",
      };

      // 1) Crear transacción en tu backend con total + detalle (y shipping opcional)
      const resp = await fetch(`${API_URL}/webpay/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, items, shipping }),
      });

      const data = await resp.json().catch(() => ({} as any));
      if (!resp.ok) {
        throw new Error(data?.error || "No se pudo crear la transacción");
      }

      const { url, token, buyOrder } = data as {
        url: string;
        token: string;
        buyOrder?: string;
      };
      if (!url || !token) throw new Error("Respuesta inválida de Webpay");

      // (opcional) guarda contexto del intento para mostrar al volver
      try {
        sessionStorage.setItem(
          "lastWebpay",
          JSON.stringify({ buyOrder, amount, when: Date.now() })
        );
      } catch {}

      // 2) Redirigir a Webpay con POST (token_ws) → evita pantalla en blanco
      postRedirect(url, { token_ws: token });

      // Nota: si el navegador navega a Webpay, el código siguiente no se ejecuta.
      // Por eso NO limpiamos el carrito aquí; hazlo en WebpayResultPage si status === "AUTHORIZED".
    } catch (e: any) {
      setError(e?.message || "Error inesperado");
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tu carrito</h1>

      {/* Lista del carrito */}
      {cart.length === 0 ? (
        <p className="opacity-70">No hay productos en el carrito.</p>
      ) : (
        <div className="space-y-2 mb-4">
          {cart.map((it) => {
            const price = Math.round(Number(it.price));
            const qty = Number(it.quantity) || 1;
            const subtotal = price * qty;
            return (
              <div
                key={it.id}
                className="flex justify-between border-b border-white/10 py-2"
              >
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm opacity-80">
                    {qty} × ${formatCLP(price)}
                  </div>
                </div>
                <div className="font-semibold">${formatCLP(subtotal)}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg">Total:</span>
        <span className="text-2xl font-bold">${formatCLP(amount)}</span>
      </div>

      <button
        onClick={handlePay}
        disabled={loading || isCartEmpty}
        className="w-full px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
      >
        {loading ? "Redirigiendo a Webpay..." : "Pagar"}
      </button>

      {error && <p className="mt-3 text-red-500">{error}</p>}

      <p className="mt-4 text-sm opacity-70">
        * El carrito se vacía cuando el pago es autorizado (hazlo en{" "}
        <code>WebpayResultPage</code>).
      </p>
    </main>
  );
}
