-- FAQ items and leaderboard scores tables replacing Airtable

-- 1. FAQ items table
CREATE TABLE IF NOT EXISTS public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- Public can view public FAQ items
CREATE POLICY "Anyone can view public FAQ items"
ON public.faq_items
FOR SELECT
USING (is_public = true);

-- Admins and super-admins can manage all FAQ items
CREATE POLICY "Admins manage FAQ items"
ON public.faq_items
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);


-- 2. Leaderboard scores table
CREATE TABLE IF NOT EXISTS public.leaderboard_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  score integer NOT NULL CHECK (score >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure email is unique to support upsert semantics (case-insensitive by storing lowercased email)
ALTER TABLE public.leaderboard_scores
  ADD CONSTRAINT leaderboard_scores_email_key UNIQUE (email);

ALTER TABLE public.leaderboard_scores ENABLE ROW LEVEL SECURITY;

-- Anyone can view leaderboard scores
CREATE POLICY "Anyone can view leaderboard scores"
ON public.leaderboard_scores
FOR SELECT
USING (true);

-- Do not grant generic insert/update/delete policies; writes go through a controlled function.


-- 3. Helper function for safe leaderboard upserts
CREATE OR REPLACE FUNCTION public.upsert_leaderboard_score(
  p_email text,
  p_name text,
  p_score integer
)
RETURNS public.leaderboard_scores
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.leaderboard_scores;
  v_email text;
BEGIN
  IF p_score < 0 THEN
    RAISE EXCEPTION 'Score must be non-negative';
  END IF;

  v_email := lower(trim(p_email));

  INSERT INTO public.leaderboard_scores (email, name, score)
  VALUES (v_email, p_name, p_score)
  ON CONFLICT (email)
  DO UPDATE
  SET
    name = EXCLUDED.name,
    score = GREATEST(public.leaderboard_scores.score, EXCLUDED.score);

  SELECT *
  INTO v_row
  FROM public.leaderboard_scores
  WHERE email = v_email;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_leaderboard_score(text, text, integer)
TO anon, authenticated;

