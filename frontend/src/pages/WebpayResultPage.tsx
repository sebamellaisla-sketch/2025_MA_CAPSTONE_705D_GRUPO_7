import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

type TxResult = {
  status: string;
  buyOrder?: string | null;
  amount?: string | null;
  authorizationCode?: string | null;
  paymentType?: string | null;
  responseCode?: string | null;
  cardNumber?: string | null;
  installmentsNumber?: string | null;
};

export default function WebpayResultPage() {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<TxResult | null>(null);

  const params = useMemo(
    () => ({
      status: searchParams.get("status") || "",
      buyOrder: searchParams.get("buyOrder"),
      amount: searchParams.get("amount"),
      authorizationCode: searchParams.get("authorizationCode"),
      paymentType: searchParams.get("paymentType"),
      responseCode: searchParams.get("responseCode"),
      cardNumber: searchParams.get("cardNumber"),
      installmentsNumber: searchParams.get("installmentsNumber"),
    }),
    [searchParams]
  );

  useEffect(() => {
    if (!params.status) {
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

  const ok =
    (result?.status || "").toUpperCase() === "AUTHORIZED" ||
    (result?.responseCode || "") === "0";

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Resultado Webpay</h1>

      {!result ? (
        <p>Cargando resultado…</p>
      ) : ok ? (
        <div className="rounded border p-4 bg-green-50">
          <h2 className="font-semibold text-green-700 mb-2">
            ¡Pago autorizado!
          </h2>
          <ul className="space-y-1">
            <li><b>Orden:</b> {result.buyOrder}</li>
            <li><b>Monto:</b> {result.amount}</li>
            <li><b>Código autorización:</b> {result.authorizationCode}</li>
            <li><b>Tipo pago:</b> {result.paymentType}</li>
            <li><b>Respuesta TBK:</b> {result.responseCode}</li>
            <li><b>Tarjeta:</b> **** **** **** {result.cardNumber}</li>
            {result.installmentsNumber && (
              <li><b>Cuotas:</b> {result.installmentsNumber}</li>
            )}
          </ul>

          <div className="mt-4">
            <Link to="/" className="text-blue-600 underline">
              Volver a la tienda
            </Link>
          </div>
        </div>
      ) : result.status === "aborted" ? (
        <div className="rounded border p-4 bg-yellow-50">
          <h2 className="font-semibold text-yellow-700 mb-2">
            Pago cancelado por el usuario
          </h2>
          <p>Orden: {result.buyOrder || "-"}</p>
          <div className="mt-4">
            <Link to="/checkout" className="text-blue-600 underline">
              Volver al checkout
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded border p-4 bg-red-50">
          <h2 className="font-semibold text-red-700 mb-2">
            Pago rechazado o error
          </h2>
          <ul className="space-y-1">
            <li><b>Orden:</b> {result.buyOrder}</li>
            <li><b>Estado:</b> {result.status}</li>
            {result.responseCode && <li><b>Respuesta TBK:</b> {result.responseCode}</li>}
          </ul>
          <div className="mt-4">
            <Link to="/checkout" className="text-blue-600 underline">
              Volver al checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
