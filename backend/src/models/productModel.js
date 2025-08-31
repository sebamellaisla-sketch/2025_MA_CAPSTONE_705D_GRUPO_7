import pool from "../config/db.js";

/**
 * Obtiene todos los productos con su categoría.
 */
export const getAllProducts = async () => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.image_url,
      p.created_at,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC;
  `);
  return result.rows;
};

/**
 * Obtiene un producto por su ID, incluyendo el nombre de la categoría.
 */
export const getProductById = async (id) => {
  const result = await pool.query(`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.image_url,
      p.created_at,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
    LIMIT 1;
  `, [id]);

  return result.rows[0] || null;
};

/**
 * Crea un nuevo producto en la base de datos.
 */
export const createProduct = async ({ name, description, price, image_url, category_id }) => {
  const result = await pool.query(
    "INSERT INTO products (name, description, price, image_url, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, description, price, image_url, category_id]
  );
  return result.rows[0];
};