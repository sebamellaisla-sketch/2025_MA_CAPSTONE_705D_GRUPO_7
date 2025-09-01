import pool from "../config/db.js";

export const getAllProducts = async (category_id) => {
  let query = "SELECT * FROM products";
  const params = [];

  if (category_id) {
    query += " WHERE category_id = $1";
    params.push(category_id);
  }

  query += " ORDER BY id ASC";

  const result = await pool.query(query, params);
  return result.rows;
};