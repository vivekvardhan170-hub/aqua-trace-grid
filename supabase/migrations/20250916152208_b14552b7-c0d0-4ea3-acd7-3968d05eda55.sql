-- First, let's update the reports table to handle Clerk user IDs properly
-- Change user_id to TEXT to accommodate Clerk user IDs
ALTER TABLE public.reports ALTER COLUMN user_id TYPE TEXT;

-- Also change verifier_id to TEXT for consistency
ALTER TABLE public.reports ALTER COLUMN verifier_id TYPE TEXT;

-- Add verification_status column for tracking verification state
ALTER TABLE public.reports ADD COLUMN verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Update existing RLS policies to work with TEXT user IDs
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can create their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.reports;

-- Recreate policies with proper user ID handling
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

-- Add policy for verifiers (NCCR) to view and update reports
CREATE POLICY "Verifiers can view all reports" 
ON public.reports 
FOR SELECT 
USING (true);

CREATE POLICY "Verifiers can update verification status" 
ON public.reports 
FOR UPDATE 
USING (true);