import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="navbar-inner flex items-center justify-between">
            <div className="flex overflow-x-auto no-scrollbar space-x-6 items-center ml-6 scroll-smooth snap-x snap-mandatory">
              {/* Enlaces principales */}
              <Link
                to="/categorias"
                className="nav-link relative group text-lg font-semibold text-white whitespace-nowrap snap-start"
              >
                <span>Productos</span>
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_100%] transition-all duration-300 group-hover:animate-gradient-move" />
              </Link>

              <ScrollLink
                to="made-in-chile"
                smooth={true}
                duration={600}
                offset={-80}
                className="nav-link relative group text-lg font-semibold text-white whitespace-nowrap snap-start cursor-pointer"
              >
                <span>Servicio de Bordado</span>
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_100%] transition-all duration-300 group-hover:animate-gradient-move" />
              </ScrollLink>

              <Link
                to="/cotiza"
                className="nav-link relative group text-lg font-semibold text-white whitespace-nowrap snap-start"
              >
                <span>Cotizar</span>
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_100%] transition-all duration-300 group-hover:animate-gradient-move" />
              </Link>

              {/* Sesión */}
              {!loading && user ? (
                <>
                  <span className="text-sm text-white/80 whitespace-nowrap snap-start">
                    {user.role === "admin" ? "Admin" : "Cliente"} #{String(user.id)}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn"
                    title="Cerrar sesión"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn">
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="btn">
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
