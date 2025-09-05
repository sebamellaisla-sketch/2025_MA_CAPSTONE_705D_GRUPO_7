import { useState, FormEvent, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config/api";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("cliente@cliente.com");
  const [password, setPassword] = useState("contraseña");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resp = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Si tu backend usa cookie httpOnly para el token:
        // credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json().catch(() => ({} as any));

      if (!resp.ok) {
        const msg =
          data?.error ||
          data?.message ||
          `HTTP ${resp.status} al conectar con /auth/login`;
        throw new Error(msg);
      }

      // soporta distintas formas de respuesta
      const token = data?.token || data?.accessToken || "";
      const u = data?.user || {
        id: data?.id ?? data?.userId ?? "",
        role: data?.role ?? "client",
        email: data?.email ?? email,
      };

      if (login) login(token, u);
      else {
        if (token) localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(u));
      }

      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 mt-24">
      <button onClick={() => navigate(-1)} className="mb-4 underline">Volver</button>
      <h1 className="text-4xl font-extrabold mb-2">Iniciar sesión</h1>
      <p className="mb-6 text-white/70">Accede a tu cuenta de TESTheb</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm mb-1">Correo electrónico</span>
          <input
            type="email"
            className="w-full rounded border px-3 py-2 bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="block">
          <span className="block text-sm mb-1">Contraseña</span>
          <input
            type="password"
            className="w-full rounded border px-3 py-2 bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && (
          <div className="rounded border border-red-400 bg-red-50/10 text-red-300 p-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
        >
          {loading ? "Conectando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-4">
        ¿No tienes una cuenta?{" "}
        <Link className="underline" to="/register">Regístrate aquí</Link>
      </p>

      <div className="mt-8 text-sm opacity-75">
        <p>Credenciales de prueba:</p>
        <p>Administrador: <b>admin@testheb.cl</b> / <b>contraseña</b></p>
      </div>
    </main>
  );
}
