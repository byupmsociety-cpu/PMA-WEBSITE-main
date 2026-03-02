-- Create storage bucket for team member images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-images',
  'team-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view team images (public bucket)
CREATE POLICY "Anyone can view team images"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-images');

-- Only admins and super-admins can upload team images
CREATE POLICY "Admins can upload team images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'team-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super-admin')
  )
);

-- Only admins and super-admins can update team images
CREATE POLICY "Admins can update team images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'team-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super-admin')
  )
);

-- Only admins and super-admins can delete team images
CREATE POLICY "Admins can delete team images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'team-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super-admin')
  )
);
