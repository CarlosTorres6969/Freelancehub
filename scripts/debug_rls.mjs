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
  console.log('=== Current policies on messages ===');
  const msgPols = await pool.query(`
    SELECT polname, polcmd, polpermissive, polroles, polqual, polwithcheck
    FROM pg_policy
    WHERE polrelid = 'messages'::regclass
  `);
  msgPols.rows.forEach(p => {
    console.log(`  ${p.polname}: cmd=${p.polcmd} check=${p.polwithcheck ? p.polwithcheck.substring(0,100) : 'null'}`);
  });

  console.log('');
  console.log('=== Current policies on conversations ===');
  const convPols = await pool.query(`
    SELECT polname, polcmd, polpermissive, polroles, polqual, polwithcheck
    FROM pg_policy
    WHERE polrelid = 'conversations'::regclass
  `);
  convPols.rows.forEach(p => {
    console.log(`  ${p.polname}: cmd=${p.polcmd} qual=${p.polqual ? p.polqual.substring(0,100) : 'null'} check=${p.polwithcheck ? p.polwithcheck.substring(0,100) : 'null'}`);
  });

  console.log('');
  console.log('=== Test with simple ANY() - direct on conversations ===');
  try {
    const r = await pool.query(`SELECT auth.uid()`);
    console.log(`  auth.uid() = ${r.rows[0].auth_uid}`);
  } catch (e) {
    console.log(`  auth.uid() ERROR: ${e.message}`);
  }

  console.log('');
  console.log('=== Checking auth schema functions ===');
  const funcs = await pool.query(`
    SELECT proname, prosrc FROM pg_proc
    WHERE pronamespace = 'auth'::regnamespace
      AND proname IN ('uid', 'role')
  `);
  funcs.rows.forEach(f => {
    console.log(`  ${f.proname}: ${f.prosrc.substring(0,80)}`);
  });
} catch (err) {
  console.error('ERROR:', err.message);
} finally {
  await pool.end();
}
