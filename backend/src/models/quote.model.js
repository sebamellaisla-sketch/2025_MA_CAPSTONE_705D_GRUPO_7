import pool from "../config/db.js";

export const createQuoteDB = async ({ user_id, name, email, phone, message }) => {
  const result = await pool.query(
    `INSERT INTO quotes (user_id, name, email, phone, message, status)
     VALUES ($1, $2, $3, $4, $5, 'pendiente')
     RETURNING *`,
    [user_id || null, name, email, phone || null, message]
  );
  return result.rows[0];
};