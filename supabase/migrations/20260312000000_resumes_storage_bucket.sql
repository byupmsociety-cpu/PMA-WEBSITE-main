-- Create the storage bucket for resumes if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the resumes bucket

-- Allow public read access to resumes
CREATE POLICY "Public Read Access for resumes"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'resumes' );

-- Allow authenticated users to upload their own resumes
CREATE POLICY "Authenticated users can upload resumes"
    ON storage.objects FOR INSERT
    WITH CHECK ( 
        bucket_id = 'resumes' 
        AND auth.role() = 'authenticated'
    );

-- Allow authenticated users to update their own resumes
CREATE POLICY "Users can update their own resumes"
    ON storage.objects FOR UPDATE
    USING ( 
        bucket_id = 'resumes' 
        AND auth.role() = 'authenticated' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes"
    ON storage.objects FOR DELETE
    USING ( 
        bucket_id = 'resumes' 
        AND auth.role() = 'authenticated' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
