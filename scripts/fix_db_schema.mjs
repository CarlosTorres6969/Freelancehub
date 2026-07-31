import pg from 'pg';

const pool = new pg.Pool({
  host: 'db.egkryibliihctjknejfg.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

try {
  await pool.query(`
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
    ALTER TABLE orders ADD CONSTRAINT orders_status_check
      CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled'));
  `);
  console.log('Status constraint updated');

  await pool.query(`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await pool.query(`
    DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
    CREATE TRIGGER trg_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  `);
  console.log('Updated_at trigger created');

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_orders_updated_at ON orders(updated_at);
    CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);
    CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
    CREATE INDEX IF NOT EXISTS idx_favorites_service_id ON favorites(service_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
  `);
  console.log('Missing indexes created');
} catch (err) {
  console.error('ERROR:', err.message);
} finally {
  await pool.end();
}
