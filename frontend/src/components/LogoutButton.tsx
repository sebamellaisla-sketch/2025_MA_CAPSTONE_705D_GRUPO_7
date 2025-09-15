import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

type Props = {
  className?: string;
  label?: string;
};

export default function LogoutButton({ className = "", label = "Cerrar sesión" }: Props) {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (auth?.logout) {
        await auth.logout();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      navigate("/login", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`btn ${busy ? "opacity-60 pointer-events-none" : ""} ${className}`}
      aria-label={label}
      title={label}
    >
      {busy ? "Saliendo..." : label}
    </button>
  );
}
