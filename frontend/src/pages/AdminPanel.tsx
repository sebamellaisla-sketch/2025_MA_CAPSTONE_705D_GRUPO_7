import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

type Producto = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
};

export default function AdminPanel() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para el formulario
  const [form, setForm] = useState<Partial<Producto>>({});
  const [editId, setEditId] = useState<number | null>(null);

  const cargarProductos = () => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then((data: Producto[]) => setProductos(data))
      .catch(() => setError("Error al cargar productos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarProducto = (e: React.FormEvent) => {
    e.preventDefault();

    const metodo = editId ? "PUT" : "POST";
    const url = editId
      ? `${API_URL}/products/${editId}`
      : `${API_URL}/products`;

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al guardar producto");
        return res.json();
      })
      .then(() => {
        setForm({});
        setEditId(null);
        cargarProductos();
      })
      .catch(() => setError("Error al guardar producto"));
  };

  const editarProducto = (producto: Producto) => {
    setForm(producto);
    setEditId(producto.id);
  };

  const eliminarProducto = (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    fetch(`${API_URL}/products/${id}`, { method: "DELETE" })
      .then(() => cargarProductos())
      .catch(() => setError("Error al eliminar producto"));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-6">Gestiona productos, categorías y pedidos.</p>

      {/* Formulario */}
      <form onSubmit={guardarProducto} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name || ""}
          onChange={manejarCambio}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={form.price || ""}
          onChange={manejarCambio}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description || ""}
          onChange={manejarCambio}
          className="border p-2 rounded md:col-span-2"
        />
        <input
          type="text"
          name="image_url"
          placeholder="URL de imagen"
          value={form.image_url || ""}
          onChange={manejarCambio}
          className="border p-2 rounded md:col-span-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-2"
        >
          {editId ? "Actualizar producto" : "Agregar producto"}
        </button>
      </form>

      {/* Lista de productos */}
      {loading ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Imagen</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.id}>
                <td className="border p-2">{prod.id}</td>
                <td className="border p-2">{prod.name}</td>
                <td className="border p-2">${prod.price}</td>
                <td className="border p-2">
                  {prod.image_url && (
                    <img src={prod.image_url} alt={prod.name} className="w-16 h-16 object-cover" />
                  )}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => editarProducto(prod)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(prod.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}