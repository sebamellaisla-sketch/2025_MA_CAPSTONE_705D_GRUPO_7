// backend/src/models/category.model.js
import pool from "../config/db.js";

export const getAllCategories = async () => {
  const result = await pool.query("SELECT * FROM categories ORDER BY created_at DESC");
  return result.rows;
};

export const getCategoryById = async (id) => {
  const result = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
  return result.rows[0];
};

export const createCategoryDB = async ({ name, image_url }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, image_url)
     VALUES ($1, $2)
     RETURNING *`,
    [name, image_url]
  );
  return result.rows[0];
};

export const updateCategoryDB = async (id, { name, image_url }) => {
  const result = await pool.query(
    `UPDATE categories 
     SET name = $1, image_url = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [name, image_url, id]
  );
  return result.rows[0];
};

export const deleteCategoryDB = async (id) => {
  const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};