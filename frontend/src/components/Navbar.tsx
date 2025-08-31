import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    "Inicio",
    "Productos",
    "Servicio de Bordado",
    "Confección",
    "Asignación de Tallas",
    "Cotizar",
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
          {/* Usamos la clase navbar-inner para controlar altura desde index.css */}
          <div className="navbar-inner space-x-8">
            {links.map((item, idx) => (
              <a
                key={idx}
                href="#"
                className="nav-link relative group opacity-0 animate-fade-in text-lg font-semibold"
                style={{
                  animationDelay: `${idx * 150 + 400}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <span>{item}</span>
                <span
                  className="absolute left-0 -bottom-1 w-full h-0.5 
                  bg-gradient-to-r from-white via-gray-300 to-white
                  bg-[length:200%_100%] 
                  transition-all duration-300 
                  group-hover:animate-gradient-move"
                ></span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        @keyframes gradient-move {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        .animate-gradient-move {
          animation: gradient-move 0.8s linear infinite;
        }
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }
      `}</style>
    </header>
  );
}