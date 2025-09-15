import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import MadeInChile from "./components/MadeInChile";
import Footer from "./components/Footer";

import logo from "./assets/logo/testheb-logo.png";

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="relative">
      <Navbar />

      {/* Hero */}
      <section
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/banner_servicios.jpg')",
        }}
      >
        <div
          className="relative z-10 max-w-3xl px-6 text-white flex flex-col items-center text-center"
          data-aos="fade-up"
        >
          {/* Logo responsivo */}
          <img
            src={logo}
            alt="Testheb Logo"
            className="logo-rounded glow mb-4 drop-shadow-lg w-32 sm:w-48 md:w-56 lg:w-72 h-auto transition-all duration-300"
          />

          <h1
            style={{ fontFamily: '"Playfair Display", serif' }}
            className="text-3xl sm:text-4xl md:text-6xl mt-2 text-white drop-shadow-lg text-center"
          >
            Bordados TESTheb
          </h1>

          <h1
            style={{ fontFamily: '"Playfair Display", serif' }}
            className="text-2xl sm:text-4xl md:text-6xl mt-2 text-white drop-shadow-lg text-center"
          >
            Calidad y Precisión en Cada Puntada
          </h1>
          <h2
            style={{ fontFamily: '"Playfair Display", serif' }}
            className="text-2xl sm:text-4xl md:text-6xl mt-2 text-white drop-shadow-lg text-center"
          >
            +569 78345612
          </h2>

          {/* Botón premium unificado */}
          <a
            href="/cotiza"
            className="btn"
          >
            Contáctanos
          </a>
        </div>
      </section>

      {/* Categorías */}
      <div data-aos="fade-up">
        <Categories />
      </div>

      {/* Hecho en Chile */}
      <div data-aos="zoom-in">
        <MadeInChile />
      </div>

      {/* Footer */}
      <div data-aos="fade-up">
        <Footer />
      </div>
    </div>
  );
}