-- Dashboard stats RPC function for efficient stat queries
-- This function returns all dashboard statistics in a single call

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
  is_member boolean;
BEGIN
  -- Check if user is a PMA member
  SELECT is_pma_member INTO is_member
  FROM public.profiles
  WHERE user_id = p_user_id;

  SELECT json_build_object(
    'new_jobs_count', CASE WHEN is_member THEN (
      SELECT COUNT(*) FROM job_postings jp
      WHERE jp.is_active = true
      AND NOT EXISTS (
        SELECT 1 FROM job_notifications jn
        WHERE jn.job_id = jp.id 
        AND jn.user_id = p_user_id 
        AND jn.viewed_at IS NOT NULL
      )
    ) ELSE 0 END,
    
    'saved_jobs_count', CASE WHEN is_member THEN (
      SELECT COUNT(*) FROM job_notifications
      WHERE user_id = p_user_id AND saved = true
    ) ELSE 0 END,
    
    'roadmap_progress', CASE WHEN is_member THEN (
      SELECT COALESCE(calculate_roadmap_completion(p_user_id), 0)
    ) ELSE 0 END,
    
    'member_count', (
      SELECT COUNT(*) FROM profiles
      WHERE is_pma_member = true 
      AND is_visible_in_directory = true
      AND is_blocked = false
      AND deleted_at IS NULL
    ),
    
    'has_roadmap', CASE WHEN is_member THEN (
      SELECT EXISTS (
        SELECT 1 FROM roadmap_profiles
        WHERE user_id = p_user_id
        AND generated_roadmap IS NOT NULL
      )
    ) ELSE false END,
    
    'has_job_preferences', CASE WHEN is_member THEN (
      SELECT EXISTS (
        SELECT 1 FROM job_preferences
        WHERE user_id = p_user_id
      )
    ) ELSE false END,
    
    'upcoming_events_count', (
      SELECT COUNT(*) FROM events
      WHERE date >= CURRENT_DATE
    ),
    
    'journey_progress', (
      SELECT COALESCE(progress_percentage, 0)
      FROM profiles
      WHERE user_id = p_user_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats(uuid) TO authenticated;
