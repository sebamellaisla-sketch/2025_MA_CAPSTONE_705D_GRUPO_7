import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

type Categoria = {
  id: number;
  name: string;
  image_url: string;
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar categorías desde la API
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then((data: Categoria[]) => {
        setCategorias(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando categorías:", err);
        setLoading(false);
      });
  }, []);

  const irACotizacion = (categoria: string) => {
    navigate(`/cotiza?categoria=${encodeURIComponent(categoria)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Botón Atrás */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300">
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="font-medium text-lg">Volver</span>
        </button>

        {/* Título principal */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            Nuestras Categorías
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Descubre nuestra amplia gama de servicios de bordado especializado
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>

        {/* Grid de categorías 2x2 compacto */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-16 mb-16">
            {categorias.map((cat, index) => (
              <div
                key={cat.id}
                onClick={() => irACotizacion(cat.name)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 max-w-48 mx-auto"
              >
                {/* Contenedor compacto sin bordes blancos */}
                <div className="bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-black/40 transition-all duration-300 shadow-lg hover:shadow-xl">
                  {/* Imagen más pequeña */}
                  <div className="relative h-16 w-full overflow-hidden">
                    <img
                      src={cat.image_url || "/catalogo/default-cat.png"}
                      alt={cat.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/catalogo/default-cat.png";
                      }}
                    />
                    {/* Overlay sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>

                  {/* Contenido compacto */}
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-white text-center group-hover:text-purple-300 transition-colors duration-300 leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA para productos */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              ¿Buscas productos específicos?
            </h2>
            <p className="text-white/70 mb-6">
              Explora nuestro catálogo completo de productos disponibles
            </p>
            <button
              onClick={() => navigate("/productos")}
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Ver Catálogo de Productos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}