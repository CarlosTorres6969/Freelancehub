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
  const result = await pool.query(`
    UPDATE auth.users
    SET
      confirmation_token        = COALESCE(confirmation_token, ''),
      recovery_token            = COALESCE(recovery_token, ''),
      email_change_token_new    = COALESCE(email_change_token_new, ''),
      email_change_token_current = COALESCE(email_change_token_current, ''),
      email_change              = COALESCE(email_change, ''),
      phone_change              = COALESCE(phone_change, ''),
      phone_change_token        = COALESCE(phone_change_token, ''),
      email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
      reauthentication_token    = COALESCE(reauthentication_token, ''),
      is_super_admin            = COALESCE(is_super_admin, false)
    WHERE confirmation_token IS NULL
       OR recovery_token IS NULL
       OR email_change_token_new IS NULL
       OR email_change_token_current IS NULL
       OR email_change IS NULL
       OR email_change_confirm_status IS NULL;
  `);
  console.log('UPDATE applied, rows affected:', result.rowCount);

  const check = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE confirmation_token IS NULL) AS ct_null,
      COUNT(*) FILTER (WHERE recovery_token IS NULL) AS rt_null,
      COUNT(*) FILTER (WHERE email_change_token_new IS NULL) AS ectn_null,
      COUNT(*) FILTER (WHERE email_change_token_current IS NULL) AS ectc_null,
      COUNT(*) FILTER (WHERE email_change IS NULL) AS ec_null,
      COUNT(*) FILTER (WHERE email_change_confirm_status IS NULL) AS eccs_null,
      COUNT(*) FILTER (WHERE phone_change IS NULL) AS pc_null,
      COUNT(*) FILTER (WHERE phone_change_token IS NULL) AS pct_null,
      COUNT(*) AS total
    FROM auth.users;
  `);
  console.log('Verification:', JSON.stringify(check.rows[0], null, 2));
} catch (err) {
  console.error('ERROR:', err.message);
} finally {
  await pool.end();
}
