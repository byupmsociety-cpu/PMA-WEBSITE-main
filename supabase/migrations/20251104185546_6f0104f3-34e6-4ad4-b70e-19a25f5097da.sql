-- Create enum for user personas
CREATE TYPE public.user_persona AS ENUM ('curious', 'starting', 'recruiting');

-- Create enum for badge types
CREATE TYPE public.badge_type AS ENUM ('milestone', 'social', 'achievement', 'special');

-- Update profiles table to include persona
ALTER TABLE public.profiles
ADD COLUMN persona public.user_persona,
ADD COLUMN onboarding_completed boolean DEFAULT false,
ADD COLUMN progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Create PM journey steps table
CREATE TABLE public.pm_journey_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  persona public.user_persona NOT NULL,
  step_order integer NOT NULL,
  category text NOT NULL, -- e.g., 'learning', 'networking', 'practice', 'applying'
  points integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(persona, step_order)
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  step_id uuid REFERENCES public.pm_journey_steps(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, step_id)
);

-- Create badges table
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  badge_type public.badge_type NOT NULL,
  icon text, -- emoji or icon name
  points_required integer,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user badges table
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create success stories table
CREATE TABLE public.success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  school_year text,
  story_text text NOT NULL,
  outcome text, -- e.g., "Landed PM internship at Microsoft"
  is_featured boolean DEFAULT false,
  persona public.user_persona,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user connections table
CREATE TABLE public.user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connected_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, connected_user_id),
  CHECK (user_id != connected_user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.pm_journey_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pm_journey_steps (public read)
CREATE POLICY "Anyone can view PM journey steps"
  ON public.pm_journey_steps FOR SELECT
  USING (true);

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view all user badges"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for success_stories
CREATE POLICY "Anyone can view success stories"
  ON public.success_stories FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own success stories"
  ON public.success_stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own success stories"
  ON public.success_stories FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_connections
CREATE POLICY "Users can view their own connections"
  ON public.user_connections FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can create connections"
  ON public.user_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update connections they're involved in"
  ON public.user_connections FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

-- Function to calculate user progress percentage
CREATE OR REPLACE FUNCTION public.calculate_user_progress(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_steps integer;
  completed_steps integer;
  progress integer;
BEGIN
  -- Get user's persona
  SELECT COUNT(*) INTO total_steps
  FROM pm_journey_steps pjs
  INNER JOIN profiles p ON p.user_id = user_uuid
  WHERE pjs.persona = p.persona;
  
  IF total_steps = 0 THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*) INTO completed_steps
  FROM user_progress
  WHERE user_id = user_uuid AND completed = true;
  
  progress := (completed_steps * 100) / total_steps;
  
  RETURN progress;
END;
$$;

-- Trigger to update progress percentage when user completes a step
CREATE OR REPLACE FUNCTION public.update_user_progress_percentage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET progress_percentage = calculate_user_progress(NEW.user_id)
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_progress_change
  AFTER INSERT OR UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_progress_percentage();

-- Insert default badges
INSERT INTO public.badges (name, description, badge_type, icon, points_required) VALUES
  ('First Step', 'Completed your first PM journey step', 'milestone', '🎯', 10),
  ('Quick Learner', 'Completed 5 steps in your PM journey', 'milestone', '⚡', 50),
  ('PM Explorer', 'Completed 10 steps in your PM journey', 'milestone', '🗺️', 100),
  ('PM Master', 'Completed all steps in your PM journey', 'achievement', '🏆', 200),
  ('Social Butterfly', 'Connected with 5 peers', 'social', '🦋', 50),
  ('Team Player', 'Connected with 10 peers', 'social', '🤝', 100),
  ('Story Teller', 'Shared your success story', 'achievement', '📖', 30),
  ('Early Adopter', 'One of the first 100 members', 'special', '🌟', 0);

-- Insert default PM journey steps for each persona
INSERT INTO public.pm_journey_steps (title, description, persona, step_order, category) VALUES
  -- Curious About PM
  ('Attend PMA Intro Workshop', 'Join our introduction workshop to learn what product management is all about', 'curious', 1, 'learning'),
  ('Read PM Fundamentals', 'Complete the essential reading list on what PMs do', 'curious', 2, 'learning'),
  ('Talk to a PM', 'Have a coffee chat with a current PM or alumni', 'curious', 3, 'networking'),
  ('Explore PM Tools', 'Learn about common tools PMs use (Figma, Jira, etc.)', 'curious', 4, 'learning'),
  ('Join PMA Community', 'Attend your first PMA social event', 'curious', 5, 'networking'),
  
  -- Starting My PM Path
  ('Build Your PM Portfolio', 'Start documenting your PM projects and experiences', 'starting', 1, 'practice'),
  ('Complete Mock Interview', 'Practice PM interview questions with peers', 'starting', 2, 'practice'),
  ('Attend PM Workshop Series', 'Join our advanced PM workshops', 'starting', 3, 'learning'),
  ('Work on a PM Project', 'Lead or contribute to a product initiative', 'starting', 4, 'practice'),
  ('Get Resume Review', 'Have your PM resume reviewed by mentors', 'starting', 5, 'applying'),
  ('Network with Alumni', 'Connect with PMA alumni in PM roles', 'starting', 6, 'networking'),
  ('Learn PM Frameworks', 'Master key frameworks (CIRCLES, AARM, etc.)', 'starting', 7, 'learning'),
  
  -- Actively Recruiting
  ('Polish Your Resume', 'Finalize your PM resume with professional feedback', 'recruiting', 1, 'applying'),
  ('Master Case Interviews', 'Complete 10+ practice case interviews', 'recruiting', 2, 'practice'),
  ('Build Your PM Story', 'Craft compelling stories for behavioral interviews', 'recruiting', 3, 'applying'),
  ('Apply to Target Companies', 'Submit applications to your dream PM roles', 'recruiting', 4, 'applying'),
  ('Attend Recruiting Events', 'Participate in company info sessions and career fairs', 'recruiting', 5, 'networking'),
  ('Practice Whiteboard Sessions', 'Master product design and strategy exercises', 'recruiting', 6, 'practice'),
  ('Get Mock Interview Feedback', 'Complete final round mock interviews', 'recruiting', 7, 'practice'),
  ('Negotiate Your Offer', 'Learn compensation negotiation strategies', 'recruiting', 8, 'applying'),
  ('Share Your Success', 'Inspire others by sharing your recruiting journey', 'recruiting', 9, 'networking');

-- Insert sample success stories
INSERT INTO public.success_stories (student_name, school_year, story_text, outcome, is_featured, persona) VALUES
  ('Sarah Chen', 'Junior', 'I joined PMA curious about product management and within a year landed my dream PM internship. The mock interviews and mentorship were game-changers!', 'PM Intern at Google', true, 'curious'),
  ('Mike Rodriguez', 'Senior', 'Starting my PM path with PMA gave me the structure I needed. The step-by-step checklist kept me accountable and the community support was incredible.', 'APM at Microsoft', true, 'starting'),
  ('Emily Thompson', 'Senior', 'The recruiting season resources and practice interviews prepared me for every question. I received 3 PM offers and negotiated my dream role!', 'PM at Amazon', true, 'recruiting');
