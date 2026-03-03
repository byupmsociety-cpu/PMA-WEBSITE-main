-- Table for event suggestions submitted from the public events page
CREATE TABLE IF NOT EXISTS public.event_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  submitter_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);

ALTER TABLE public.event_suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can submit a suggestion
CREATE POLICY "Anyone can submit event suggestions"
ON public.event_suggestions
FOR INSERT
WITH CHECK (true);

-- Only admins and super-admins can view, update, or delete suggestions
CREATE POLICY "Admins can view event suggestions"
ON public.event_suggestions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super-admin')
  )
);

CREATE POLICY "Admins can update event suggestions"
ON public.event_suggestions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super-admin')
  )
);

CREATE POLICY "Admins can delete event suggestions"
ON public.event_suggestions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super-admin')
  )
);
