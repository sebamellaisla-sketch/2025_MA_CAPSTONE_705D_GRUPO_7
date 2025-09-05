import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

type Categoria = {
  id: number;
  name: string;
  image_url?: string;
};

export default function Categories() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 640) setSlidesToShow(1);
      else if (window.innerWidth < 1024) setSlidesToShow(2);
      else setSlidesToShow(3);
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then((data: Categoria[]) => setCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === categorias.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [categorias.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);
  const goToPrevious = () =>
    setCurrentIndex(currentIndex === 0 ? categorias.length - 1 : currentIndex - 1);
  const goToNext = () =>
    setCurrentIndex(currentIndex === categorias.length - 1 ? 0 : currentIndex + 1);

  return (
    <section className="py-8 bg-gray-100">
      <h2
        style={{ fontFamily: '"Playfair Display", serif' }}
        className="text-2xl text-center mb-6 text-gray-800"
      >
        Nuestras Categorías
      </h2>

      <div className="max-w-5xl mx-auto px-4">
        <div className="relative mx-4">
          {/* Carrusel */}
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
              }}
            >
              {[...categorias, ...categorias].map((cat, index) => (
                <div
                  key={`${cat.id}-${index}`}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <Link
                    to="/categorias"
                    className="block group relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative" style={{ height: "280px" }}>
                      <img
                        src={cat.image_url || "/catalogo/default-cat.png"}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-bold text-white text-center group-hover:text-yellow-300 transition-colors duration-300">
                          {cat.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Botones navegación */}
          <button
            onClick={goToPrevious}
            className="bg-purple-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900 hover:shadow-yellow-500/50 hover:scale-110 absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="bg-purple-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900 hover:shadow-yellow-500/50 hover:scale-110 absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Botones de acción con clase global .btn */}
        <div className="text-center mt-10 flex flex-col sm:flex-row sm:justify-center sm:space-x-6 space-y-4 sm:space-y-0">
          <Link to="/categorias" className="btn">
            Ver Todas las Categorías
          </Link>

          <Link to="/cotiza" className="btn">
            Solicitar Cotización
          </Link>
        </div>
      </div>
    </section>
  );
}