import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

type Producto = {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  image_url?: string;
};

export default function ProductPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ahora obtenemos total y totalItems directamente del contexto (ya calculados)
  const { cart, addToCart, removeFromCart, clearCart, total, totalItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Cargar productos desde la API
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then((data: Producto[]) => setProductos(data))
      .catch(() => setError("No se pudieron cargar los productos. Intenta más tarde."))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { 
        state: { from: "/checkout" }
      });
    } else {
      navigate("/checkout");
    }
  };

  if (loading) return <div className="p-6">Cargando productos...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Botón Atrás */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        ← Atrás
      </button>

      <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>

      {/* Layout de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        
        {/* Columna de productos */}
        <div>
          <p className="mb-6 text-gray-600">
            Total de productos: <strong>{productos.length}</strong>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos.map(producto => (
              <div
                key={producto.id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="w-full h-48 overflow-hidden bg-white">
                  <img
                    src={producto.image_url || "/catalogo/default.png"}
                    alt={producto.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold">{producto.name}</h3>
                  {producto.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {producto.description}
                    </p>
                  )}
                  <p className="text-blue-600 font-bold mt-2">
                    ${Number(producto.price).toLocaleString("es-CL")}
                  </p>
                  <button
                    onClick={() => {
                      // Asegurar que el precio sea un número
                      const priceAsNumber = typeof producto.price === 'string' 
                        ? parseFloat(producto.price) 
                        : producto.price;
                      
                      addToCart({
                        id: producto.id,
                        name: producto.name,
                        price: priceAsNumber,
                        quantity: 1
                      });
                    }}
                    className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna del carrito */}
        <aside className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-5 h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Tu carrito</h3>
            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
              {totalItems}
            </span>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Carrito vacío</p>
          ) : (
            <>
              <ul className="max-h-60 overflow-y-auto divide-y mb-4">
                {cart.map(item => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-gray-500">
                        ${Number(item.price).toLocaleString("es-CL")} c/u × {item.quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition ml-2"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg">
                  Total: ${total.toLocaleString("es-CL")}
                </span>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Pagar
                </button>
              </div>

              <button
                onClick={clearCart}
                className="w-full bg-gray-300 py-1 rounded hover:bg-gray-400 text-sm"
              >
                Vaciar carrito
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}