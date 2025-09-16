-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can create their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can update all reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;

-- Change user_id and verifier_id to TEXT to accommodate Clerk user IDs
ALTER TABLE public.reports ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.reports ALTER COLUMN verifier_id TYPE TEXT;

-- Add verification_status column for tracking verification state
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Create updated RLS policies for Clerk authentication
CREATE POLICY "Users can view their own reports" 
ON public.reports 
FOR SELECT 
USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can create their own reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own reports" 
ON public.reports 
FOR UPDATE 
USING (auth.jwt() ->> 'sub' = user_id);

-- Add policies for verifiers (NCCR role) to view and update all reports
CREATE POLICY "Verifiers can view all reports" 
ON public.reports 
FOR SELECT 
USING (true);

CREATE POLICY "Verifiers can update verification status" 
ON public.reports 
FOR UPDATE 
USING (true);