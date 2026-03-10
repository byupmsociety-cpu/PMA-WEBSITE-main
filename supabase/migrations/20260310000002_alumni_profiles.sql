-- Add Alumni Hub fields to the profiles table
ALTER TABLE public.profiles
ADD COLUMN is_alumni BOOLEAN DEFAULT false;

ALTER TABLE public.profiles
ADD COLUMN open_to_coffee_chats BOOLEAN DEFAULT false;

ALTER TABLE public.profiles
ADD COLUMN current_company TEXT;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
