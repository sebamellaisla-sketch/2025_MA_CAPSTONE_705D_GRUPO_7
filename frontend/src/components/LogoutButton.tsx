import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // (opcional) si tu backend tiene /api/auth/logout y usas cookies httpOnly:
    // try {
    //   await fetch(
    //     `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/logout`,
    //     { method: "POST", credentials: "include" }
    //   );
    // } catch {}

    // Si usas JWT guardado en el front:
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // quita esto si no lo usas

    // Redirige al login (o a donde prefieras)
    navigate("/login", { replace: true });
    // Alternativa: window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
      title="Cerrar sesión"
    >
      Cerrar sesión
    </button>
  );
}
