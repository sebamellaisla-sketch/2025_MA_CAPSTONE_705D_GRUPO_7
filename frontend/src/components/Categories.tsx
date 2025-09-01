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

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then((data: Categoria[]) => setCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  return (
    <section className="py-12 bg-gray-100">
      <h2
        style={{ fontFamily: '"Playfair Display", serif' }}
        className="text-3xl text-center mb-8 text-gray-800 drop-shadow-sm"
      >
        Categorías
      </h2>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {categorias.map(cat => (
          <Link
            key={cat.id}
            to={`/categorias/${cat.id}`}
            className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={cat.image_url || "/catalogo/default-cat.png"}
              alt={cat.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-2 text-center font-semibold">{cat.name}</div>
          </Link>
        ))}

        {/* Tarjeta extra para cotización */}
        <Link
          to="/cotiza"
          className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-yellow-100 flex flex-col items-center justify-center"
        >
          <span className="text-lg font-bold p-4">📝 Cotiza con nosotros</span>
        </Link>
      </div>
    </section>
  );
}