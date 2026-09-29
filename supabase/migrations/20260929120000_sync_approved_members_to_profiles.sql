-- Keep existing profiles in sync with the pre-approved member list.
--
-- Previously approved_pma_members was only consulted by handle_new_user() at
-- signup, so adding (or bulk-uploading) an email for someone who already had an
-- account left them stuck as a guest. This trigger re-evaluates the matching
-- profile whenever a list row is added, changed, or removed:
--   * email approved + enabled  -> guest is upgraded to the row's default_role
--   * email disabled / removed   -> member is downgraded to guest
-- Admins and super-admins are never changed by this sync (role management for
-- them stays manual), and blocked or soft-deleted profiles are skipped.

-- 1. Recompute one email's membership from the list and apply it to its profile
CREATE OR REPLACE FUNCTION public.sync_profile_membership(target_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  approved_role TEXT;
BEGIN
  IF target_email IS NULL THEN
    RETURN;
  END IF;

  SELECT m.default_role INTO approved_role
  FROM public.approved_pma_members m
  WHERE LOWER(m.email) = LOWER(target_email)
    AND m.is_disabled IS NOT TRUE
  LIMIT 1;

  IF approved_role IS NOT NULL THEN
    UPDATE public.profiles
    SET role = approved_role,
        is_pma_member = true,
        membership_verified_at = COALESCE(membership_verified_at, now())
    WHERE LOWER(email) = LOWER(target_email)
      AND role = 'guest'
      AND is_blocked IS NOT TRUE
      AND deleted_at IS NULL;
  ELSE
    UPDATE public.profiles
    SET role = 'guest',
        is_pma_member = false
    WHERE LOWER(email) = LOWER(target_email)
      AND role = 'member'
      AND is_blocked IS NOT TRUE
      AND deleted_at IS NULL;
  END IF;
END;
$$;

-- Only the trigger (and the backfill below) should call this directly
REVOKE EXECUTE ON FUNCTION public.sync_profile_membership(TEXT) FROM PUBLIC, anon, authenticated;

-- 2. Trigger on the approved list
CREATE OR REPLACE FUNCTION public.handle_approved_member_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM public.sync_profile_membership(NEW.email);
  END IF;

  -- A delete, or an email edit, may leave the old address unapproved
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND LOWER(OLD.email) IS DISTINCT FROM LOWER(NEW.email)) THEN
    PERFORM public.sync_profile_membership(OLD.email);
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS sync_profiles_on_approved_member_change ON public.approved_pma_members;

CREATE TRIGGER sync_profiles_on_approved_member_change
AFTER INSERT OR DELETE OR UPDATE OF email, is_disabled, default_role
ON public.approved_pma_members
FOR EACH ROW
EXECUTE FUNCTION public.handle_approved_member_change();

-- 3. One-time backfill: upgrade existing guests whose email is already approved
UPDATE public.profiles p
SET role = m.default_role,
    is_pma_member = true,
    membership_verified_at = COALESCE(p.membership_verified_at, now())
FROM public.approved_pma_members m
WHERE LOWER(m.email) = LOWER(p.email)
  AND m.is_disabled IS NOT TRUE
  AND p.role = 'guest'
  AND p.is_blocked IS NOT TRUE
  AND p.deleted_at IS NULL;
