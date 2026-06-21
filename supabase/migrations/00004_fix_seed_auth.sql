-- Fix login for seed users: add missing auth.identities records
-- Seed users were inserted directly into auth.users but lack entries in auth.identities,
-- which is required for signInWithPassword() to work.

DO $$
DECLARE
  user_rec RECORD;
BEGIN
  FOR user_rec IN
    SELECT id, email FROM auth.users
    WHERE email IN ('maria.garcia@email.com', 'juan.perez@email.com', 'ana.lopez@email.com')
  LOOP
    -- Check if identity already exists
    IF NOT EXISTS (
      SELECT 1 FROM auth.identities
      WHERE user_id = user_rec.id
        AND provider = 'email'
    ) THEN
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        user_rec.id,
        jsonb_build_object('sub', user_rec.id, 'email', user_rec.email),
        'email',
        user_rec.email,
        now(),
        now(),
        now()
      );
    END IF;
  END LOOP;
END $$;
