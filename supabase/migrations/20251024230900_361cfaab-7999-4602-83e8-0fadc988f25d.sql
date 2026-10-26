-- Add category_id column if it doesn't exist
DO $$ 
BEGIN 
  IF to_regclass('public.resource_clicks') IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resource_clicks' 
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE public.resource_clicks ADD COLUMN category_id TEXT NOT NULL DEFAULT '';
  END IF;
END $$;