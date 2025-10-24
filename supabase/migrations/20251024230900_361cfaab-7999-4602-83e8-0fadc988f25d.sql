-- Add category_id column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'resource_clicks' 
    AND column_name = 'category_id'
  ) THEN
    ALTER TABLE public.resource_clicks ADD COLUMN category_id TEXT NOT NULL DEFAULT '';
  END IF;
END $$;