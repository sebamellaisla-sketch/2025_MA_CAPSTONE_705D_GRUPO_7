import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError("El nombre es obligatorio"), false;
    if (!formData.email.trim()) return setError("El email es obligatorio"), false;
    if (formData.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres"), false;
    if (formData.password !== formData.confirmPassword) return setError("Las contraseñas no coinciden"), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "client"
        })
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) return setError(registerData.error || "Error al registrar usuario");

      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const loginData = await loginRes.json();
      if (loginRes.ok) {
        login(loginData.token, { id: loginData.id, role: loginData.role, email: loginData.email || formData.email });
        navigate(location.state?.from || "/checkout", { replace: true });
      } else {
        navigate("/login?registered=true", { state: { from: location.state?.from || "/checkout" } });
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
            <p className="text-white/70">Únete a Bordados TESTheb</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "Nombre completo *", name: "name", type: "text", placeholder: "Tu nombre completo" },
              { label: "Correo electrónico *", name: "email", type: "email", placeholder: "tu@email.com" },
              { label: "Contraseña *", name: "password", type: "password", placeholder: "Mínimo 6 caracteres" },
              { label: "Confirmar contraseña *", name: "confirmPassword", type: "password", placeholder: "Repite tu contraseña" }
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-white font-medium mb-2">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder={field.placeholder}
                  required
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-500/20 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Botón usando estilo global */}
            <button type="submit" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70">
              ¿Ya tienes una cuenta?{" "}
              <Link 
                to="/login" 
                state={{ from: location.state?.from || "/checkout" }}
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
