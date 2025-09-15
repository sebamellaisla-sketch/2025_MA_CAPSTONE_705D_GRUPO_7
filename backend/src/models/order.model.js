// backend/src/models/order.model.js
import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

// Flags cacheadas de columnas
let HAS_TOTAL = false;
let HAS_SHIP_ADDRESS = false;
let HAS_SHIP_CITY = false;
let HAS_SHIP_REGION = false;
let HAS_SHIP_ZIP = false;
let HAS_CUST_NAME = false;
let HAS_CUST_EMAIL = false;
let HAS_CUST_PHONE = false;
let HAS_NOTES = false;

async function columnExists(column) {
  const q = `
    SELECT 1
    FROM information_schema.columns
    WHERE table_name='orders' AND column_name=$1
    LIMIT 1;
  `;
  const { rows } = await pool.query(q, [column]);
  return rows.length > 0;
}

export async function ensureOrdersTable() {
  // Crea la tabla si no existe (mínima)
  await pool.query(`CREATE TABLE IF NOT EXISTS orders ( id SERIAL PRIMARY KEY );`);

  // Agrega columnas faltantes (no destruye datos)
  const add = async (name, ddl) => {
    if (!(await columnExists(name))) {
      await pool.query(`ALTER TABLE orders ADD COLUMN ${ddl};`);
    }
  };

  await add("buy_order", "buy_order TEXT");
  await add("session_id", "session_id TEXT");
  await add("user_id", "user_id INTEGER");
  await add("amount", "amount INTEGER");
  await add("total", "total INTEGER"); // si tu esquema lo usa
  await add("status", "status TEXT");
  await add("authorization_code", "authorization_code TEXT");
  await add("response_code", "response_code INTEGER");
  await add("payment_type_code", "payment_type_code TEXT");
  await add("card_last4", "card_last4 TEXT");
  await add("installments_number", "installments_number INTEGER");
  await add("token_ws", "token_ws TEXT");
  await add("items", "items JSONB");
  await add("result_json", "result_json JSONB");
  await add("created_at", "created_at TIMESTAMPTZ DEFAULT NOW()");
  await add("updated_at", "updated_at TIMESTAMPTZ DEFAULT NOW()");

  // Campos de despacho/cliente (si tu tabla ya los tiene con NOT NULL, no se tocan)
  await add("shipping_address", "shipping_address TEXT");
  await add("shipping_city", "shipping_city TEXT");
  await add("shipping_region", "shipping_region TEXT");
  await add("shipping_zip", "shipping_zip TEXT");
  await add("customer_name", "customer_name TEXT");
  await add("customer_email", "customer_email TEXT");
  await add("customer_phone", "customer_phone TEXT");
  await add("notes", "notes TEXT");

  // Índices
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`);
  try {
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS orders_buy_order_key ON orders(buy_order);`);
  } catch {}

  // Flags
  HAS_TOTAL = await columnExists("total");
  HAS_SHIP_ADDRESS = await columnExists("shipping_address");
  HAS_SHIP_CITY = await columnExists("shipping_city");
  HAS_SHIP_REGION = await columnExists("shipping_region");
  HAS_SHIP_ZIP = await columnExists("shipping_zip");
  HAS_CUST_NAME = await columnExists("customer_name");
  HAS_CUST_EMAIL = await columnExists("customer_email");
  HAS_CUST_PHONE = await columnExists("customer_phone");
  HAS_NOTES = await columnExists("notes");
}

/**
 * Inserta/actualiza la orden en estado "created".
 * shipping = { address, city, region, zip, name, email, phone, notes }
 */
export async function createOrder({
  buyOrder,
  sessionId,
  amount,
  userId = null,
  items = [],
  shipping = {},
}) {
  const amt = Number(amount);
  const safeItems = Array.isArray(items) ? items : [];

  // Columnas y valores dinámicos
  const cols = ["buy_order", "session_id", "amount", "status", "items"];
  const params = [buyOrder, sessionId, amt, "created", JSON.stringify(safeItems)];
  const ph = params.map((_, i) => `$${i + 1}`);

  // user_id
  cols.push("user_id");
  params.push(userId);
  ph.push(`$${params.length}`);

  // total = amount (si existe)
  if (HAS_TOTAL) {
    cols.push("total");
    params.push(amt);
    ph.push(`$${params.length}`);
  }

  // shipping fields (si existen en tu tabla)
  if (HAS_SHIP_ADDRESS) {
    cols.push("shipping_address");
    params.push(String(shipping.address ?? "N/A")); // cumple NOT NULL
    ph.push(`$${params.length}`);
  }
  if (HAS_SHIP_CITY) {
    cols.push("shipping_city");
    params.push(String(shipping.city ?? ""));
    ph.push(`$${params.length}`);
  }
  if (HAS_SHIP_REGION) {
    cols.push("shipping_region");
    params.push(String(shipping.region ?? ""));
    ph.push(`$${params.length}`);
  }
  if (HAS_SHIP_ZIP) {
    cols.push("shipping_zip");
    params.push(String(shipping.zip ?? ""));
    ph.push(`$${params.length}`);
  }
  if (HAS_CUST_NAME) {
    cols.push("customer_name");
    params.push(String(shipping.name ?? ""));
    ph.push(`$${params.length}`);
  }
  if (HAS_CUST_EMAIL) {
    cols.push("customer_email");
    params.push(String(shipping.email ?? ""));
    ph.push(`$${params.length}`);
  }
  if (HAS_CUST_PHONE) {
    cols.push("customer_phone");
    params.push(String(shipping.phone ?? ""));
    ph.push(`$${params.length}`);
  }
  if (HAS_NOTES) {
    cols.push("notes");
    params.push(String(shipping.notes ?? ""));
    ph.push(`$${params.length}`);
  }

  // SET dinámico para el ON CONFLICT
  const updatable = ["amount", "items", "user_id"];
  if (HAS_TOTAL) updatable.push("total");
  if (HAS_SHIP_ADDRESS) updatable.push("shipping_address");
  if (HAS_SHIP_CITY) updatable.push("shipping_city");
  if (HAS_SHIP_REGION) updatable.push("shipping_region");
  if (HAS_SHIP_ZIP) updatable.push("shipping_zip");
  if (HAS_CUST_NAME) updatable.push("customer_name");
  if (HAS_CUST_EMAIL) updatable.push("customer_email");
  if (HAS_CUST_PHONE) updatable.push("customer_phone");
  if (HAS_NOTES) updatable.push("notes");

  const setClause = updatable.map((c) => `${c}=EXCLUDED.${c}`).join(", ");

  const sql = `
    INSERT INTO orders (${cols.join(",")})
    VALUES (${ph.join(",")})
    ON CONFLICT (buy_order)
    DO UPDATE SET ${setClause}, updated_at=NOW()
    RETURNING *;
  `;

  const { rows } = await pool.query(sql, params);
  return rows[0];
}

export async function markOrderAborted({ buyOrder }) {
  await pool.query(
    `UPDATE orders SET status='aborted', updated_at=NOW() WHERE buy_order=$1;`,
    [buyOrder]
  );
}

export async function updateOrderOnCommit({ buyOrder, result, token_ws }) {
  const last4 = result?.card_detail?.card_number || null;

  const q = `
    UPDATE orders
    SET status = $2,
        authorization_code = $3,
        response_code = $4,
        payment_type_code = $5,
        card_last4 = $6,
        installments_number = $7,
        token_ws = $8,
        result_json = $9,
        updated_at = NOW()
    WHERE buy_order = $1;
  `;

  await pool.query(q, [
    buyOrder,                                      // $1
    String(result?.status || "").toLowerCase(),    // $2
    result?.authorization_code || null,            // $3
    result?.response_code ?? null,                 // $4
    result?.payment_type_code || null,             // $5
    last4,                                         // $6
    result?.installments_number ?? null,           // $7
    token_ws || null,                              // $8
    result ? JSON.stringify(result) : null,        // $9
  ]);
}
