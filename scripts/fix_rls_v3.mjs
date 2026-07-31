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
  console.log('Creating helper in public schema...');
  await pool.query(`
    CREATE OR REPLACE FUNCTION public.is_conversation_participant(conv_id uuid)
    RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
      SELECT EXISTS (
        SELECT 1 FROM conversations
        WHERE id = conv_id
          AND auth.uid() = ANY(participant_ids)
      );
    $$;
  `);

  console.log('Dropping old policies...');
  await pool.query(`
    DROP POLICY IF EXISTS "messages_select_participant" ON messages;
    DROP POLICY IF EXISTS "messages_insert_participant" ON messages;
    DROP POLICY IF EXISTS "conversations_select_participant" ON conversations;
    DROP POLICY IF EXISTS "conversations_insert_auth" ON conversations;
    DROP POLICY IF EXISTS "conversations_update_participant" ON conversations;
  `);

  console.log('Creating new policies...');
  await pool.query(`
    CREATE POLICY "conversations_select_participant" ON conversations
      FOR SELECT USING (auth.uid() = ANY(participant_ids));

    CREATE POLICY "conversations_insert_auth" ON conversations
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "conversations_update_participant" ON conversations
      FOR UPDATE USING (auth.uid() = ANY(participant_ids));

    CREATE POLICY "messages_select_participant" ON messages
      FOR SELECT USING (public.is_conversation_participant(conversation_id));

    CREATE POLICY "messages_insert_participant" ON messages
      FOR INSERT WITH CHECK (public.is_conversation_participant(conversation_id));
  `);

  console.log('All policies updated!');
} catch (err) {
  console.error('ERROR:', err.message);
} finally {
  await pool.end();
}
