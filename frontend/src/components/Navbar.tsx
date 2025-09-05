import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const auth = useContext(AuthContext);
  const { user, loading } = auth || {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (auth?.logout) await auth.logout();
      else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } finally {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 50);
      setIsVisible(!(currentScroll > lastScrollY && currentScroll > 100));
      setLastScrollY(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    setIsMounted(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const links = [
    { name: "Inicio", path: "/" },
    { name: "Productos", path: "/categorias" },
    { name: "Servicio de Bordado", path: "#" },
    { name: "Confección", path: "#" },
    { name: "Asignación de Tallas", path: "#" },
    { name: "Cotizar", path: "/cotiza" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[9999] transition-transform duration-500 ${
        isMounted ? "animate-slide-down" : "opacity-0"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav
        className={`navbar ${
          isScrolled ? "navbar-scrolled" : "navbar-default"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="navbar-inner space-x-8 flex items-center">
            {links.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="nav-link relative group text-lg font-semibold text-white"
              >
                <span>{item.name}</span>
                <span
                  className="absolute left-0 -bottom-1 w-full h-0.5 
                  bg-gradient-to-r from-white via-gray-300 to-white
                  bg-[length:200%_100%] 
                  transition-all duration-300 
                  group-hover:animate-gradient-move"
                />
              </Link>
            ))}

            <div className="ml-auto flex items-center gap-3">
              {!loading && user ? (
                <>
                  <span className="text-sm text-white/80">
                    {user.role === "admin" ? "Admin" : "Cliente"} #{String(user.id)}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded bg-white/15 hover:bg-white/25 transition"
                    title="Cerrar sesión"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded bg-white/15 hover:bg-white/25 transition"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 rounded bg-white text-black hover:bg-gray-100 transition"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
