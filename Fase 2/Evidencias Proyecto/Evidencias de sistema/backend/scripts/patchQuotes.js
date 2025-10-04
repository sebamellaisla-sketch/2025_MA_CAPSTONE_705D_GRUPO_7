import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const client = new pg.Client({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'bordados_testheb'
})

const statements = [
  `CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(180) NOT NULL,
      phone VARCHAR(50),
      message TEXT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pendiente',
      source VARCHAR(50) NOT NULL DEFAULT 'contact_form',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
  `ALTER TABLE quotes ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'contact_form';`,
  `ALTER TABLE quotes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;`,
  `ALTER TABLE quotes ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;`,
  `CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);`,
  `CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);`,
  `CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);`,
  `CREATE TABLE IF NOT EXISTS quote_attachments (
      id SERIAL PRIMARY KEY,
      quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
      file_name VARCHAR(255) NOT NULL,
      original_name VARCHAR(255),
      file_path VARCHAR(300) NOT NULL,
      mime_type VARCHAR(120),
      file_size INTEGER,
      uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
  `CREATE INDEX IF NOT EXISTS idx_quote_attachments_quote_id ON quote_attachments(quote_id);`
]

try {
  await client.connect()
  for (const sql of statements) {
    await client.query(sql)
  }
  console.log('✅ Tablas de cotización y adjuntos verificadas correctamente.')
} catch (error) {
  console.error('❌ Error aplicando migración:', error)
  process.exitCode = 1
} finally {
  await client.end()
}
