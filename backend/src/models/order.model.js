// backend/src/models/order.model.js
import pool from "../config/db.js";

export const createOrderDB = async ({ user_id, total, items, shipping_address, phone }) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Crear el pedido principal
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, status, shipping_address, phone)
       VALUES ($1, $2, 'pendiente', $3, $4)
       RETURNING *`,
      [user_id, total, shipping_address, phone]
    );

    const order = orderResult.rows[0];

    // Agregar items del pedido
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getOrdersByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT o.*, 
            json_agg(
              json_build_object(
                'product_id', oi.product_id,
                'product_name', p.name,
                'quantity', oi.quantity,
                'price', oi.price
              )
            ) as items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

export const getAllOrders = async () => {
  const result = await pool.query(
    `SELECT o.*, u.name as user_name, u.email as user_email,
            json_agg(
              json_build_object(
                'product_id', oi.product_id,
                'product_name', p.name,
                'quantity', oi.quantity,
                'price', oi.price
              )
            ) as items
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN products p ON oi.product_id = p.id
     GROUP BY o.id, u.name, u.email
     ORDER BY o.created_at DESC`
  );
  return result.rows;
};

export const updateOrderStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};