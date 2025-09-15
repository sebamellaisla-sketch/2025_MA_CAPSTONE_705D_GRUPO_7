import pool from "../config/db.js";

export const createQuoteDB = async ({
  user_id,
  name,
  email,
  phone,
  message,
  attachment_url,
  attachment_mime,
}) => {
  const result = await pool.query(
    `INSERT INTO quotes
       (user_id, name, email, phone, message, status, attachment_url, attachment_mime)
     VALUES
       ($1,      $2,   $3,    $4,    $5,      'pendiente', $6,            $7)
     RETURNING *`,
    [
      user_id || null,
      name,
      email,
      phone || null,
      message,
      attachment_url || null,
      attachment_mime || null,
    ]
  );
  return result.rows[0];
};
