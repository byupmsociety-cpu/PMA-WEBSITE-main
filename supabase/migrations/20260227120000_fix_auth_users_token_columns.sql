-- Fix existing users created via SQL that have NULL token columns.
-- Supabase Auth fails sign-in with "Database error querying schema" when these are NULL.
-- Run this if you already created users via migration before the token-column fix.
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, '')
WHERE confirmation_token IS NULL
   OR recovery_token IS NULL
   OR email_change_token_new IS NULL
   OR email_change IS NULL;
