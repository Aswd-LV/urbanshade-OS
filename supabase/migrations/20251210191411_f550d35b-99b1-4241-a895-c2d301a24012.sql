-- Create table for UUR submissions
CREATE TABLE public.uur_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_name TEXT NOT NULL,
  github_url TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

-- Enable RLS
ALTER TABLE public.uur_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can read submissions (public list)
CREATE POLICY "Anyone can view submissions"
ON public.uur_submissions
FOR SELECT
USING (true);

-- Anyone can insert submissions (including guests)
CREATE POLICY "Anyone can submit packages"
ON public.uur_submissions
FOR INSERT
WITH CHECK (true);

-- Add to realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE uur_submissions;