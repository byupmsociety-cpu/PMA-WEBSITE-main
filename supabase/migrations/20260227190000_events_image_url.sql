-- Add image_url to events for flyer/attachment display
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS image_url text;
