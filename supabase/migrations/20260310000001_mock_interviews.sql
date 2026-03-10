-- Migration: Mock Interview System
-- Tables to handle peer-to-peer mock interview availability and bookings.

CREATE TABLE public.mock_interview_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE TABLE public.mock_interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slot_id UUID REFERENCES public.mock_interview_slots(id) ON DELETE CASCADE NOT NULL,
    interviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    interviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    meeting_link TEXT,
    feedback_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.mock_interview_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;

-- Polices for mock_interview_slots
-- Anyone can view available slots
CREATE POLICY "Anyone can view mock interview slots" 
ON public.mock_interview_slots FOR SELECT 
USING (true);

-- Users can insert their own slots (using profile id, which matches auth.uid())
CREATE POLICY "Users can create their own slots" 
ON public.mock_interview_slots FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own unbooked slots
CREATE POLICY "Users can delete their own slots" 
ON public.mock_interview_slots FOR DELETE 
USING (auth.uid() = user_id AND is_booked = FALSE);

-- Users can update slots (e.g., when they get booked, but typically this is handled via function or secure policy. 
-- For now, allow interviewee to set is_booked to true, or owner to modify)
CREATE POLICY "Users can update their own slots or book open slots" 
ON public.mock_interview_slots FOR UPDATE
USING (auth.uid() = user_id OR is_booked = FALSE);

-- Policies for mock_interviews
-- Interviewers and interviewees can view their own interviews
CREATE POLICY "Participants can view their own interviews" 
ON public.mock_interviews FOR SELECT 
USING (auth.uid() = interviewer_id OR auth.uid() = interviewee_id);

-- Interviewees can insert (book) an interview
CREATE POLICY "Users can book interviews" 
ON public.mock_interviews FOR INSERT 
WITH CHECK (auth.uid() = interviewee_id);

-- Participants can update their own interviews (e.g. to cancel, or interviewer to leave feedback)
CREATE POLICY "Participants can update their interviews" 
ON public.mock_interviews FOR UPDATE 
USING (auth.uid() = interviewer_id OR auth.uid() = interviewee_id);

-- Create trigger to automatically update the `updated_at` column for mock_interviews
CREATE TRIGGER update_mock_interviews_updated_at
BEFORE UPDATE ON public.mock_interviews
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
