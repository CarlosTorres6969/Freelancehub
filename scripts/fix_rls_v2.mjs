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
  console.log('Dropping all conversation/message policies...');
  await pool.query(`
    DROP POLICY IF EXISTS "messages_select_participant" ON messages;
    DROP POLICY IF EXISTS "messages_insert_participant" ON messages;
    DROP POLICY IF EXISTS "conversations_select_participant" ON conversations;
    DROP POLICY IF EXISTS "conversations_update_participant" ON conversations;
    DROP POLICY IF EXISTS "conversations_insert_auth" ON conversations;
  `);

  console.log('Creating new policies without ANY()...');
  await pool.query(`
    CREATE POLICY "conversations_select_participant" ON conversations
      FOR SELECT USING (participant_ids @> ARRAY[auth.uid()]::uuid[]);

    CREATE POLICY "conversations_insert_auth" ON conversations
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "conversations_update_participant" ON conversations
      FOR UPDATE USING (participant_ids @> ARRAY[auth.uid()]::uuid[]);

    CREATE POLICY "messages_select_participant" ON messages
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM conversations
          WHERE id = messages.conversation_id
            AND participant_ids @> ARRAY[auth.uid()]::uuid[]
        )
      );

    CREATE POLICY "messages_insert_participant" ON messages
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM conversations
          WHERE id = conversation_id
            AND participant_ids @> ARRAY[auth.uid()]::uuid[]
        )
      );
  `);

  console.log('All policies updated!');
} catch (err) {
  console.error('ERROR:', err.message);
} finally {
  await pool.end();
}
