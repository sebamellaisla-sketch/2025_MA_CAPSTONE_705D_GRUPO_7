import { useNavigate } from "react-router-dom";

const categorias = [
  { nombre: "Bordados Empresa", imagen: "/categorias/empresa.jpg" },
  { nombre: "Colegios", imagen: "/categorias/colegios.jpg" },
  { nombre: "Diseños Personalizados", imagen: "/categorias/personalizados.jpg" },
  { nombre: "Mascotas", imagen: "/categorias/mascotas.jpg" },
];

export default function CategoriasPage() {
  const navigate = useNavigate();

  const irACotizacion = (categoria: string) => {
    navigate(`/cotiza?categoria=${encodeURIComponent(categoria)}`);
  };

  return (
    <div className="p-6">
      {/* Título con gradiente */}
      <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Catálogo de Categorías
      </h1>

      {/* Lista de categorías con animación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {categorias.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => irACotizacion(cat.nombre)}
            className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 bg-white/5 backdrop-blur-md"
          >
            <div className="overflow-hidden">
              <img
                src={cat.imagen}
                alt={cat.nombre}
                className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4 text-center font-semibold text-lg text-white">
              {cat.nombre}
            </div>
          </div>
        ))}
      </div>

      {/* Sección de productos disponibles */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Nuestros productos disponibles
        </h2>
        <button
          onClick={() => navigate("/productos")}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Ver productos
        </button>
      </div>
    </div>
  );
}