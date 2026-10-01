-- First-party site analytics: page views and logins, readable only by admins.

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'login')),
  path text NOT NULL CHECK (char_length(path) <= 512),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_id text NOT NULL CHECK (char_length(visitor_id) <= 64),
  session_id text NOT NULL CHECK (char_length(session_id) <= 64),
  referrer text CHECK (char_length(referrer) <= 1024),
  user_agent text CHECK (char_length(user_agent) <= 512)
);

CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON public.analytics_events (user_id);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone may record an event, but only as themselves (or anonymously).
DROP POLICY IF EXISTS "Anyone can record analytics events" ON public.analytics_events;
CREATE POLICY "Anyone can record analytics events"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can read analytics events" ON public.analytics_events;
CREATE POLICY "Admins can read analytics events"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Aggregated report for the admin analytics page.
CREATE OR REPLACE FUNCTION public.admin_analytics_report(since timestamptz)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  WITH ev AS (
    SELECT * FROM public.analytics_events WHERE created_at >= since
  )
  SELECT jsonb_build_object(
    'totals', (
      SELECT jsonb_build_object(
        'page_views', count(*) FILTER (WHERE event_type = 'page_view'),
        'unique_visitors', count(DISTINCT visitor_id),
        'signed_in_users', count(DISTINCT user_id),
        'logins', count(*) FILTER (WHERE event_type = 'login')
      ) FROM ev
    ),
    'daily', COALESCE((
      SELECT jsonb_agg(d ORDER BY d.day)
      FROM (
        SELECT date_trunc('day', created_at)::date AS day,
               count(*) FILTER (WHERE event_type = 'page_view') AS page_views,
               count(DISTINCT visitor_id) AS visitors
        FROM ev GROUP BY 1
      ) d
    ), '[]'::jsonb),
    'top_pages', COALESCE((
      SELECT jsonb_agg(p ORDER BY p.views DESC)
      FROM (
        SELECT path, count(*) AS views, count(DISTINCT visitor_id) AS visitors
        FROM ev WHERE event_type = 'page_view'
        GROUP BY path ORDER BY views DESC LIMIT 20
      ) p
    ), '[]'::jsonb),
    'users', COALESCE((
      SELECT jsonb_agg(u ORDER BY u.last_seen DESC)
      FROM (
        SELECT ev.user_id,
               pr.full_name,
               pr.email,
               count(*) FILTER (WHERE ev.event_type = 'page_view') AS page_views,
               count(*) FILTER (WHERE ev.event_type = 'login') AS logins,
               max(ev.created_at) AS last_seen
        FROM ev
        LEFT JOIN public.profiles pr ON pr.user_id = ev.user_id
        WHERE ev.user_id IS NOT NULL
        GROUP BY ev.user_id, pr.full_name, pr.email
        ORDER BY last_seen DESC LIMIT 100
      ) u
    ), '[]'::jsonb),
    'recent', COALESCE((
      SELECT jsonb_agg(r ORDER BY r.created_at DESC)
      FROM (
        SELECT ev.created_at, ev.event_type, ev.path, ev.visitor_id,
               pr.full_name, pr.email
        FROM ev
        LEFT JOIN public.profiles pr ON pr.user_id = ev.user_id
        ORDER BY ev.created_at DESC LIMIT 100
      ) r
    ), '[]'::jsonb)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_analytics_report(timestamptz) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_analytics_report(timestamptz) TO authenticated;
