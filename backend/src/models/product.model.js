// backend/src/models/product.model.js
import pool from "../config/db.js";

export const getAllProducts = async (category_id) => {
  let query = "SELECT * FROM products";
  const params = [];

  if (category_id) {
    query += " WHERE category_id = $1";
    params.push(category_id);
  }

  query += " ORDER BY created_at DESC";

  const result = await pool.query(query, params);
  return result.rows;
};

export const getProductById = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
};

export const createProductDB = async ({ name, description, price, image_url, category_id }) => {
  const result = await pool.query(
    `INSERT INTO products (name, description, price, image_url, category_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description, price, image_url, category_id]
  );
  return result.rows[0];
};

export const updateProductDB = async (id, { name, description, price, image_url, category_id }) => {
  const result = await pool.query(
    `UPDATE products 
     SET name = $1, description = $2, price = $3, image_url = $4, category_id = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
    [name, description, price, image_url, category_id, id]
  );
  return result.rows[0];
};

export const deleteProductDB = async (id) => {
  const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};