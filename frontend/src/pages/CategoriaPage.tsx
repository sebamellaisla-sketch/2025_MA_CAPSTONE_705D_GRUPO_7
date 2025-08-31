import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import styles from "./CategoriaPage.module.css";

// Definimos el tipo de producto que devuelve el backend
type Producto = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
};

export default function CategoriaPage() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const categoriaFormateada = categoriaId
    ?.split("-")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");

  return (
    <div className={styles.categoriaPage}>
      <div className={styles.categoriaHeader}>
        <button onClick={() => navigate(-1)} className={styles.btnAtras}>
          ← Atrás
        </button>
        <h1 className={styles.categoriaTitulo}>{categoriaFormateada}</h1>
      </div>

      <div className={styles.gridProductos}>
        {productos.map((producto) => (
          <div key={producto.id} className={styles.productoCard}>
            <div className={styles.productoImagenContainer}>
              <img
                src={producto.image_url}
                alt={producto.name}
                className={styles.productoImagen}
                loading="lazy"
              />
            </div>
            <div className={styles.productoInfo}>
              <h3 className={styles.productoNombre}>{producto.name}</h3>
              <p className={styles.productoPrecio}>
                ${producto.price.toLocaleString("es-CL")}
              </p>
              <button className={styles.btnAgregar}>Agregar al carrito</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}