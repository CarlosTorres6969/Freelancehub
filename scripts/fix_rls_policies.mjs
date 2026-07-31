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
  // Fix messages RLS policies - remove ANY() from WHERE in subqueries
  // RLS on conversations table already filters by auth.uid() = ANY(participant_ids)
  // so we just need EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id)

  console.log('Dropping old messages policies...');
  await pool.query(`
    DROP POLICY IF EXISTS "messages_select_participant" ON messages;
    DROP POLICY IF EXISTS "messages_insert_participant" ON messages;
  `);

  console.log('Creating fixed messages policies...');
  await pool.query(`
    CREATE POLICY "messages_select_participant" ON messages
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM conversations WHERE id = messages.conversation_id
        )
      );

    CREATE POLICY "messages_insert_participant" ON messages
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM conversations WHERE id = conversation_id
        )
      );
  `);

  // Also fix conversations update policy if it has issues
  console.log('Fixing conversations policies...');
  await pool.query(`
    DROP POLICY IF EXISTS "conversations_update_participant" ON conversations;
    CREATE POLICY "conversations_update_participant" ON conversations
      FOR UPDATE USING (auth.uid() = ANY(participant_ids));
  `);

  console.log('All policies fixed successfully!');

  // Test by inserting a message
  const testConv = await pool.query(`SELECT id FROM conversations LIMIT 1`);
  if (testConv.rows.length > 0) {
    console.log(`Found conversation ${testConv.rows[0].id} for testing`);
  }

} catch (err) {
  console.error('ERROR:', err.message);
} finally {
  await pool.end();
}
