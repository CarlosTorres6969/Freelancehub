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
  // Check if trigger exists on auth.users
  const r1 = await pool.query(`
    SELECT tgname FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass
      AND tgname = 'on_auth_user_created'
      AND NOT tgisinternal;
  `);

  if (r1.rows.length === 0) {
    console.log('Trigger on_auth_user_created is MISSING. Re-creating it...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION handle_new_user()
      RETURNS TRIGGER AS $$
      DECLARE
        user_email TEXT;
        user_name TEXT;
        user_role TEXT;
      BEGIN
        user_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email');
      user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(COALESCE(user_email, 'usuario'), '@', 1)
      );
      user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');

      INSERT INTO public.profiles (id, email, name, role)
        VALUES (NEW.id, user_email, user_name);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

      CREATE OR REPLACE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION handle_new_user();
    `);
    console.log('Trigger re-created on auth.users');
  } else {
    console.log('Trigger on_auth_user_created already exists');
  }
} catch (err) {
  console.error('ERROR:', err.message);
} finally {
  await pool.end();
}
