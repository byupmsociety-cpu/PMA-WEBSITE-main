-- Migration to add salary_type to job_preferences
ALTER TABLE job_preferences ADD COLUMN salary_type text DEFAULT 'annual' CHECK (salary_type IN ('annual', 'hourly'));
