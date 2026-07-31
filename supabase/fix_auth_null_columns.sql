-- =====================================================
-- FIX: GoTrue "Database error querying schema" 500 error
-- Causa: columnas NULL en auth.users que GoTrue no tolera
-- Referencia: https://github.com/supabase/supabase/issues/43193
-- =====================================================

BEGIN;

-- 1. Fix NULL token columns (GoTrue espera '', no NULL)
UPDATE auth.users
SET
  confirmation_token        = COALESCE(confirmation_token, ''),
  recovery_token            = COALESCE(recovery_token, ''),
  email_change_token_new    = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  email_change              = COALESCE(email_change, ''),
  phone_change              = COALESCE(phone_change, ''),
  phone_change_token        = COALESCE(phone_change_token, ''),
  confirmation_sent_at      = COALESCE(confirmation_sent_at, NOW()),
  recovery_sent_at          = COALESCE(recovery_sent_at, NOW()),
  confirmed_at              = COALESCE(confirmed_at, NOW()),
  email_change_sent_at      = COALESCE(email_change_sent_at, NOW()),
  last_sign_in_at           = COALESCE(last_sign_in_at, NOW()),
  phone_confirmed_at        = COALESCE(phone_confirmed_at, NOW())
WHERE confirmation_token IS NULL
   OR recovery_token IS NULL
   OR email_change_token_new IS NULL;

-- 2. Fix NULL integer columns
UPDATE auth.users
SET
  email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
  banned_until                = NULL,
  reauthentication_token      = COALESCE(reauthentication_token, ''),
  is_super_admin              = COALESCE(is_super_admin, false);

COMMIT;

-- Verificar que ya no hay NULLs problemáticos
SELECT
  COUNT(*) FILTER (WHERE confirmation_token IS NULL) AS confirmation_token_nulls,
  COUNT(*) FILTER (WHERE recovery_token IS NULL) AS recovery_token_nulls,
  COUNT(*) FILTER (WHERE email_change_token_new IS NULL) AS email_change_token_new_nulls,
  COUNT(*) FILTER (WHERE email_change_token_current IS NULL) AS email_change_token_current_nulls,
  COUNT(*) FILTER (WHERE email_change IS NULL) AS email_change_nulls,
  COUNT(*) FILTER (WHERE email_change_confirm_status IS NULL) AS email_change_confirm_status_nulls
FROM auth.users;
