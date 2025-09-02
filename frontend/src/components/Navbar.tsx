import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 50);

      if (currentScroll > lastScrollY && currentScroll > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    setIsMounted(true);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const links = [
    { name: "Inicio", path: "/" },
    { name: "Productos", path: "/categorias/1" }, // 🔹 Redirige a categorías
    { name: "Servicio de Bordado", path: "#" },
    { name: "Confección", path: "#" },
    { name: "Asignación de Tallas", path: "#" },
    { name: "Cotizar", path: "/cotiza" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${
        isMounted ? "animate-slide-down" : "opacity-0"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav
        className={`navbar ${isScrolled ? "navbar-scrolled" : "navbar-default"}`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="navbar-inner space-x-8 flex items-center">
            {links.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="nav-link relative group opacity-0 animate-fade-in text-lg font-semibold"
                style={{
                  animationDelay: `${idx * 150 + 400}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <span>{item.name}</span>
                <span
                  className="absolute left-0 -bottom-1 w-full h-0.5 
                  bg-gradient-to-r from-white via-gray-300 to-white
                  bg-[length:200%_100%] 
                  transition-all duration-300 
                  group-hover:animate-gradient-move"
                ></span>
              </Link>
            ))}

            {!loading && user && (
              <span className="ml-auto text-sm text-white">
                {user.role === "admin" ? "Admin" : "Cliente"} #{user.id}
              </span>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}