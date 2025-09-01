import pool from "../config/db.js";

export const getAllCategories = async () => {
  const result = await pool.query("SELECT id, name, image_url FROM categories ORDER BY id ASC");
  return result.rows;
};