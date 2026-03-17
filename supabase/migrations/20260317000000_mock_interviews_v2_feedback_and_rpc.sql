-- Migration: Mock Interview System v2
-- - Fix unsafe RLS on slot updates
-- - Add atomic booking RPC
-- - Add structured + freeform feedback
-- - Add mentor opt-in scaffolding

-- 0) Helper: admin check (inline pattern used elsewhere)
-- NOTE: We intentionally avoid creating a separate SQL function for this to match existing migration style.

-- 1) Extend slots for richer matching (peer vs mentor, types, duration)
ALTER TABLE public.mock_interview_slots
  ADD COLUMN IF NOT EXISTS slot_type text NOT NULL DEFAULT 'peer' CHECK (slot_type IN ('peer','mentor')),
  ADD COLUMN IF NOT EXISTS interview_type text NOT NULL DEFAULT 'general' CHECK (interview_type IN ('general','behavioral','product','case')),
  ADD COLUMN IF NOT EXISTS duration_minutes integer NOT NULL DEFAULT 60 CHECK (duration_minutes IN (30,45,60));

-- 2) Extend interviews for lifecycle tracking
ALTER TABLE public.mock_interviews
  ADD COLUMN IF NOT EXISTS completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cancellation_reason text;

-- Keep status constraint aligned with additional states (if needed later).
-- The base table already has CHECK (status IN ('scheduled','completed','cancelled')).

-- 3) Mentor opt-in scaffolding
CREATE TABLE IF NOT EXISTS public.mock_interview_mentors (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  topics text[] DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_interview_mentors ENABLE ROW LEVEL SECURITY;

-- Mentor can view/update their own mentor profile; admins can manage all.
DROP POLICY IF EXISTS "Mentors can view their own mentor settings" ON public.mock_interview_mentors;
CREATE POLICY "Mentors can view their own mentor settings"
ON public.mock_interview_mentors
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Mentors can update their own mentor settings" ON public.mock_interview_mentors;
CREATE POLICY "Mentors can update their own mentor settings"
ON public.mock_interview_mentors
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage mentor settings" ON public.mock_interview_mentors;
CREATE POLICY "Admins manage mentor settings"
ON public.mock_interview_mentors
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- 4) Feedback table (structured rubric + freeform notes/bullets)
CREATE TABLE IF NOT EXISTS public.mock_interview_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rubric jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  strengths text,
  improvements text,
  action_items text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT one_feedback_per_reviewer UNIQUE (interview_id, reviewer_id)
);

ALTER TABLE public.mock_interview_feedback ENABLE ROW LEVEL SECURITY;

-- Participants can view feedback for their interview; admins can view all
DROP POLICY IF EXISTS "Participants can view mock interview feedback" ON public.mock_interview_feedback;
CREATE POLICY "Participants can view mock interview feedback"
ON public.mock_interview_feedback
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.mock_interviews mi
    WHERE mi.id = interview_id
      AND (auth.uid() = mi.interviewer_id OR auth.uid() = mi.interviewee_id)
  )
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- Only interviewer can create/update their feedback entry; admins can update any
DROP POLICY IF EXISTS "Interviewers can create feedback" ON public.mock_interview_feedback;
CREATE POLICY "Interviewers can create feedback"
ON public.mock_interview_feedback
FOR INSERT
WITH CHECK (
  reviewer_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.mock_interviews mi
    WHERE mi.id = interview_id
      AND mi.interviewer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Interviewers can update feedback" ON public.mock_interview_feedback;
CREATE POLICY "Interviewers can update feedback"
ON public.mock_interview_feedback
FOR UPDATE
USING (
  reviewer_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
)
WITH CHECK (
  reviewer_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- updated_at trigger
DROP TRIGGER IF EXISTS update_mock_interview_feedback_updated_at ON public.mock_interview_feedback;
CREATE TRIGGER update_mock_interview_feedback_updated_at
BEFORE UPDATE ON public.mock_interview_feedback
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 5) Fix unsafe slot UPDATE policy and introduce atomic booking RPC
-- Existing v1 policy allows anyone to update any unbooked slot (too permissive).

DROP POLICY IF EXISTS "Users can update their own slots or book open slots" ON public.mock_interview_slots;

DROP POLICY IF EXISTS "Users can update their own slots" ON public.mock_interview_slots;
CREATE POLICY "Users can update their own slots"
ON public.mock_interview_slots
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND is_booked = false);

-- Admins can manage all slots (moderation / cleanup)
DROP POLICY IF EXISTS "Admins manage mock interview slots" ON public.mock_interview_slots;
CREATE POLICY "Admins manage mock interview slots"
ON public.mock_interview_slots
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- Admins can view all interviews (participants already can view their own)
DROP POLICY IF EXISTS "Admins can view all mock interviews" ON public.mock_interviews;
CREATE POLICY "Admins can view all mock interviews"
ON public.mock_interviews
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- Admins can update/cancel interviews (moderation / fixes)
DROP POLICY IF EXISTS "Admins manage mock interviews" ON public.mock_interviews;
CREATE POLICY "Admins manage mock interviews"
ON public.mock_interviews
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin','super-admin')
  )
);

-- Atomic booking RPC: books slot + creates interview
CREATE OR REPLACE FUNCTION public.book_mock_interview(p_slot_id uuid)
RETURNS public.mock_interviews
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slot public.mock_interview_slots;
  v_interview public.mock_interviews;
BEGIN
  -- Lock slot row to prevent double booking
  SELECT *
  INTO v_slot
  FROM public.mock_interview_slots
  WHERE id = p_slot_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Slot not found';
  END IF;

  IF v_slot.is_booked THEN
    RAISE EXCEPTION 'Slot already booked';
  END IF;

  IF v_slot.start_time <= now() THEN
    RAISE EXCEPTION 'Slot is in the past';
  END IF;

  IF v_slot.user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot book your own slot';
  END IF;

  UPDATE public.mock_interview_slots
  SET is_booked = true
  WHERE id = v_slot.id
    AND is_booked = false;

  INSERT INTO public.mock_interviews (slot_id, interviewer_id, interviewee_id, status)
  VALUES (v_slot.id, v_slot.user_id, auth.uid(), 'scheduled')
  RETURNING * INTO v_interview;

  RETURN v_interview;
END;
$$;

GRANT EXECUTE ON FUNCTION public.book_mock_interview(uuid) TO authenticated;

-- RPC: cancel an interview and reopen the slot
CREATE OR REPLACE FUNCTION public.cancel_mock_interview(p_interview_id uuid, p_reason text DEFAULT NULL)
RETURNS public.mock_interviews
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_interview public.mock_interviews;
BEGIN
  SELECT *
  INTO v_interview
  FROM public.mock_interviews
  WHERE id = p_interview_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Interview not found';
  END IF;

  IF NOT (auth.uid() = v_interview.interviewer_id OR auth.uid() = v_interview.interviewee_id) THEN
    RAISE EXCEPTION 'Not permitted';
  END IF;

  IF v_interview.status = 'cancelled' THEN
    RETURN v_interview;
  END IF;

  UPDATE public.mock_interviews
  SET status = 'cancelled',
      cancelled_at = now(),
      cancelled_by = auth.uid(),
      cancellation_reason = p_reason,
      updated_at = now()
  WHERE id = v_interview.id
  RETURNING * INTO v_interview;

  UPDATE public.mock_interview_slots
  SET is_booked = false
  WHERE id = v_interview.slot_id;

  RETURN v_interview;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_mock_interview(uuid, text) TO authenticated;

-- RPC: mark an interview completed (keeps slot booked)
CREATE OR REPLACE FUNCTION public.complete_mock_interview(p_interview_id uuid)
RETURNS public.mock_interviews
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_interview public.mock_interviews;
BEGIN
  SELECT *
  INTO v_interview
  FROM public.mock_interviews
  WHERE id = p_interview_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Interview not found';
  END IF;

  IF NOT (auth.uid() = v_interview.interviewer_id OR auth.uid() = v_interview.interviewee_id) THEN
    RAISE EXCEPTION 'Not permitted';
  END IF;

  IF v_interview.status = 'completed' THEN
    RETURN v_interview;
  END IF;

  UPDATE public.mock_interviews
  SET status = 'completed',
      completed_at = now(),
      updated_at = now()
  WHERE id = v_interview.id
  RETURNING * INTO v_interview;

  RETURN v_interview;
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_mock_interview(uuid) TO authenticated;

-- 6) Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mock_interview_slots_start_time ON public.mock_interview_slots (start_time);
CREATE INDEX IF NOT EXISTS idx_mock_interview_slots_user_id ON public.mock_interview_slots (user_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_interviewer_id ON public.mock_interviews (interviewer_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_interviewee_id ON public.mock_interviews (interviewee_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_status ON public.mock_interviews (status);
CREATE INDEX IF NOT EXISTS idx_mock_interview_feedback_interview_id ON public.mock_interview_feedback (interview_id);

