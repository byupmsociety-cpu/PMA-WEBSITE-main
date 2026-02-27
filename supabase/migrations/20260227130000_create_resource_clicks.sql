-- Create resource_clicks table for tracking resource popularity (used by Resources page "Most Used by Students" carousel)
CREATE TABLE IF NOT EXISTS public.resource_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_title text NOT NULL,
  category_id text NOT NULL DEFAULT '',
  clicked_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resource_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (for aggregating click counts)
CREATE POLICY "Anyone can view resource clicks"
  ON public.resource_clicks FOR SELECT
  USING (true);

-- Allow anyone to insert (track clicks from anonymous and logged-in users)
CREATE POLICY "Anyone can track resource clicks"
  ON public.resource_clicks FOR INSERT
  WITH CHECK (true);
