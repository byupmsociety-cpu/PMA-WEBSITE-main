-- Fix RLS policies on asset_reviews so that both admins and super-admins
-- can view and update all resume reviews.

DO $$
BEGIN
  -- Drop existing admin policies on asset_reviews if they exist
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'asset_reviews'
      AND policyname = 'Admins can view all reviews'
  ) THEN
    DROP POLICY "Admins can view all reviews" ON public.asset_reviews;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'asset_reviews'
      AND policyname = 'Admins can update reviews'
  ) THEN
    DROP POLICY "Admins can update reviews" ON public.asset_reviews;
  END IF;

  -- Recreate policies with correct role values ('admin', 'super-admin')
  CREATE POLICY "Admins can view all reviews"
    ON public.asset_reviews FOR SELECT
    USING (
      EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND p.role IN ('admin', 'super-admin')
      )
    );

  CREATE POLICY "Admins can update reviews"
    ON public.asset_reviews FOR UPDATE
    USING (
      EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND p.role IN ('admin', 'super-admin')
      )
    );
END $$;

