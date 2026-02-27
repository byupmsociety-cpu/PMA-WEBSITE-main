-- Create super-admin user (bypasses frontend @byu.edu check - user created directly in DB)
-- Email: byupmsociety@gmail.com
-- Password: superadminPM123
-- The handle_new_user trigger will create the profile; we then set role to super-admin.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT := crypt('superadminPM123', gen_salt('bf'));
BEGIN
  -- Skip if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'byupmsociety@gmail.com') THEN
    UPDATE public.profiles
    SET role = 'super-admin'
    WHERE email = 'byupmsociety@gmail.com' AND role != 'super-admin';
    RETURN;
  END IF;

  v_user_id := gen_random_uuid();

  -- 1. Insert the user into auth.users
  -- Token columns must be empty strings, not NULL, or sign-in fails with "Database error querying schema"
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'byupmsociety@gmail.com',
    v_encrypted_pw,
    NOW(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"PMA Super Admin"}'::jsonb,
    NOW(),
    NOW()
  );

  -- 2. Link an identity so the user can sign in
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    v_user_id,
    format('{"sub": "%s", "email": "byupmsociety@gmail.com"}', v_user_id)::jsonb,
    'email',
    v_user_id::text,
    NOW(),
    NOW(),
    NOW()
  );

  -- 3. Profile is created by handle_new_user trigger. Set role to super-admin.
  UPDATE public.profiles
  SET role = 'super-admin'
  WHERE email = 'byupmsociety@gmail.com';
END $$;
