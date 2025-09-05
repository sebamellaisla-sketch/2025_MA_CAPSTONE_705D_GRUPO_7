import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

type TxResult = {
  status: string;
  buyOrder?: string | null;
  amount?: string | null;
  authorizationCode?: string | null;
  paymentType?: string | null;
  responseCode?: string | null;
  cardNumber?: string | null;            // últimos 4 (desde backend)
  installmentsNumber?: string | null;
};

const paymentTypeMap: Record<string, string> = {
  VD: "Débito",
  VP: "Prepago",
  VN: "Crédito (sin cuotas)",
  VC: "Crédito en cuotas",
  SI: "3 cuotas sin interés",
  S2: "2 cuotas sin interés",
  NC: "N cuotas sin interés",
};

function formatCLP(v?: string | null) {
  const n = Math.round(Number(v ?? 0));
  return `$ ${n.toLocaleString("es-CL")}`;
}

export default function WebpayResultPage() {
  const [sp] = useSearchParams();
  const { clearCart } = useContext(CartContext);
  const [result, setResult] = useState<TxResult | null>(null);
  const clearedRef = useRef(false);

  const params = useMemo(
    () => ({
      status: sp.get("status") || "",
      buyOrder: sp.get("buyOrder"),
      amount: sp.get("amount"),
      authorizationCode: sp.get("authorizationCode"),
      paymentType: sp.get("paymentType"),
      responseCode: sp.get("responseCode"),
      cardNumber: sp.get("cardNumber"),
      installmentsNumber: sp.get("installmentsNumber"),
    }),
    [sp]
  );

  // Normaliza resultado desde query params
  useEffect(() => {
    const st = (params.status || "").toUpperCase();
    if (!st) {
      setResult({
        status: "error",
        buyOrder: null,
        amount: null,
        authorizationCode: null,
        paymentType: null,
        responseCode: null,
        cardNumber: null,
        installmentsNumber: null,
      });
      return;
    }
    setResult(params as TxResult);
  }, [params]);

  // Éxito si status=AUTHORIZED o responseCode=0
  const isOk = useMemo(() => {
    const st = (result?.status || "").toUpperCase();
    const rc = String(result?.responseCode ?? "");
    return st === "AUTHORIZED" || rc === "0";
  }, [result]);

  // Limpia carrito una sola vez si fue autorizado
  useEffect(() => {
    if (!result) return;
    if (isOk && !clearedRef.current) {
      clearedRef.current = true;
      try {
        clearCart();
        // Limpia también cualquier “lastWebpay” que hayas guardado
        sessionStorage.removeItem("lastWebpay");
      } catch {}
    }
  }, [isOk, result, clearCart]);

  // Helpers visuales
  const maskedLast4 =
    result?.cardNumber && result.cardNumber.trim()
      ? `**** **** **** ${result.cardNumber}`
      : "-";

  const paymentTypeLabel =
    (result?.paymentType && paymentTypeMap[result.paymentType]) ||
    result?.paymentType ||
    "-";

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-4">Resultado Webpay</h1>

      {!result ? (
        <div className="rounded border p-4 bg-neutral-900/30">Cargando…</div>
      ) : isOk ? (
        <div className="rounded border p-4 bg-green-50 text-green-900">
          <h2 className="font-semibold text-lg mb-3">¡Pago autorizado!</h2>
          <ul className="space-y-1">
            <li>
              <b>Orden:</b> {result.buyOrder}
            </li>
            <li>
              <b>Monto:</b> {formatCLP(result.amount)}
            </li>
            <li>
              <b>Código de autorización:</b> {result.authorizationCode || "-"}
            </li>
            <li>
              <b>Tipo de pago:</b> {paymentTypeLabel}
            </li>
            <li>
              <b>Respuesta TBK:</b> {result.responseCode ?? "-"}
            </li>
            <li>
              <b>Tarjeta:</b> {maskedLast4}
            </li>
            {result.installmentsNumber && result.installmentsNumber !== "0" && (
              <li>
                <b>Cuotas:</b> {result.installmentsNumber}
              </li>
            )}
          </ul>

          <div className="mt-5 flex gap-4">
            <Link to="/" className="text-blue-700 underline">
              Volver a la tienda
            </Link>
            <Link to="/categorias" className="text-blue-700 underline">
              Seguir comprando
            </Link>
          </div>
        </div>
      ) : (result.status || "").toUpperCase() === "ABORTED" ? (
        <div className="rounded border p-4 bg-yellow-50 text-yellow-900">
          <h2 className="font-semibold text-lg mb-2">
            Pago cancelado por el usuario
          </h2>
          <p className="mb-2">
            <b>Orden:</b> {result.buyOrder || "-"}
          </p>
          <div className="mt-4 flex gap-4">
            <Link to="/checkout" className="text-blue-700 underline">
              Volver al checkout
            </Link>
            <Link to="/categorias" className="text-blue-700 underline">
              Seguir comprando
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded border p-4 bg-red-50 text-red-900">
          <h2 className="font-semibold text-lg mb-2">
            Pago rechazado o error
          </h2>
          <ul className="space-y-1">
            <li>
              <b>Orden:</b> {result.buyOrder || "-"}
            </li>
            <li>
              <b>Estado:</b> {result.status}
            </li>
            {result.responseCode && (
              <li>
                <b>Respuesta TBK:</b> {result.responseCode}
              </li>
            )}
          </ul>
          <div className="mt-4 flex gap-4">
            <Link to="/checkout" className="text-blue-700 underline">
              Reintentar pago
            </Link>
            <Link to="/" className="text-blue-700 underline">
              Volver a la tienda
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
