-- Update RLS policies to properly handle Clerk authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can create their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.reports;
DROP POLICY IF EXISTS "Verifiers can view all reports" ON public.reports;
DROP POLICY IF EXISTS "Verifiers can update verification status" ON public.reports;

-- Create updated policies for Clerk authentication (user_id is TEXT for Clerk IDs)
CREATE POLICY "Users can view their own reports" 
ON public.reports 
FOR SELECT 
USING (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can create their own reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (user_id = (auth.jwt() ->> 'sub'::text));

CREATE POLICY "Users can update their own reports" 
ON public.reports 
FOR UPDATE 
USING (user_id = (auth.jwt() ->> 'sub'::text));

-- NCCR verifiers can view and update all reports
CREATE POLICY "Verifiers can view all reports" 
ON public.reports 
FOR SELECT 
USING (true);

CREATE POLICY "Verifiers can update verification status" 
ON public.reports 
FOR UPDATE 
USING (true);