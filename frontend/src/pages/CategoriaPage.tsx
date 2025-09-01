import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

type Producto = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: number;
};

export default function CategoriaPage() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    if (!categoriaId) return;

    fetch(`${API_URL}/products?category_id=${categoriaId}`)
      .then(res => res.json())
      .then((data: Producto[]) => setProductos(data))
      .catch(err => console.error("Error cargando productos:", err));
  }, [categoriaId]);

  const categoriaFormateada = categoriaId
    ?.split("-")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          ← Atrás
        </button>
        <h1 className="text-3xl font-bold">{categoriaFormateada}</h1>
      </div>

      {/* Lista de productos */}
      {productos.length === 0 ? (
        <p className="text-center text-lg text-gray-500">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map(producto => (
            <div
              key={producto.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col"
            >
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={producto.image_url || "/catalogo/default.png"}
                  alt={producto.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold">{producto.name}</h3>
                <p className="text-blue-600 font-bold mt-2">
                  ${producto.price.toLocaleString("es-CL")}
                </p>
                <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}