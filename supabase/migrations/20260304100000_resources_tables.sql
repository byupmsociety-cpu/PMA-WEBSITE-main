-- Resources management tables for admin-managed content

-- 1. Create resource_categories table
CREATE TABLE IF NOT EXISTS public.resource_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'FileText',
  color text NOT NULL DEFAULT 'from-blue-500 to-cyan-500',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.resource_categories(id) ON DELETE CASCADE,
  subcategory text,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  url text NOT NULL,
  image_url text NOT NULL DEFAULT '',
  tips text[] DEFAULT '{}',
  is_paid boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_category_id ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_subcategory ON public.resources(subcategory);
CREATE INDEX IF NOT EXISTS idx_resource_categories_slug ON public.resource_categories(slug);
CREATE INDEX IF NOT EXISTS idx_resource_categories_display_order ON public.resource_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_resources_display_order ON public.resources(display_order);

-- 4. Add updated_at triggers
CREATE TRIGGER update_resource_categories_updated_at
BEFORE UPDATE ON public.resource_categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 5. Enable RLS
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for resource_categories

-- Public read access
CREATE POLICY "Anyone can view resource categories"
ON public.resource_categories
FOR SELECT
USING (true);

-- Admin-only insert
CREATE POLICY "Admins can insert resource categories"
ON public.resource_categories
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super-admin')
  )
);

-- Admin-only update
CREATE POLICY "Admins can update resource categories"
ON public.resource_categories
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super-admin')
  )
);

-- Admin-only delete
CREATE POLICY "Admins can delete resource categories"
ON public.resource_categories
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super-admin')
  )
);

-- 7. RLS Policies for resources

-- Public read access
CREATE POLICY "Anyone can view resources"
ON public.resources
FOR SELECT
USING (true);

-- Admin-only insert
CREATE POLICY "Admins can insert resources"
ON public.resources
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super-admin')
  )
);

-- Admin-only update
CREATE POLICY "Admins can update resources"
ON public.resources
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super-admin')
  )
);

-- Admin-only delete
CREATE POLICY "Admins can delete resources"
ON public.resources
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'super-admin')
  )
);
