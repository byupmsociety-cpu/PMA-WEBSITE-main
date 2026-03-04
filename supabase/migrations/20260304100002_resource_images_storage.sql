-- Create storage bucket for resource images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resource-images',
  'resource-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view resource images (public bucket)
CREATE POLICY "Anyone can view resource images"
ON storage.objects FOR SELECT
USING (bucket_id = 'resource-images');

-- Only admins and super-admins can upload resource images
CREATE POLICY "Admins can upload resource images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resource-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super-admin')
  )
);

-- Only admins and super-admins can update resource images
CREATE POLICY "Admins can update resource images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resource-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super-admin')
  )
);

-- Only admins and super-admins can delete resource images
CREATE POLICY "Admins can delete resource images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resource-images' AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super-admin')
  )
);
