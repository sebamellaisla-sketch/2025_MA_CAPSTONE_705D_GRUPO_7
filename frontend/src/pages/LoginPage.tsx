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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Contenedor con efecto glass */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Iniciar sesión</h1>
            <p className="text-white/70">Accede a tu cuenta de TESTheb</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-pink-500/30 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Conectando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70">
              ¿No tienes una cuenta?{" "}
              <Link 
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300" 
                to="/register"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-8 text-sm text-white/60">
            <p>Credenciales de prueba:</p>
            <p>Administrador: <b>admin@testheb.cl</b> / <b>password</b></p>
            <p>Cliente: <b>cliente@cliente.com</b> / <b>cliente123</b></p>
            <p>Asegúrate de encender la base de datos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
