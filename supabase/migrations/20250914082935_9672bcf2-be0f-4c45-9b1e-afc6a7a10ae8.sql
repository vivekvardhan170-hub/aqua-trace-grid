-- Create storage bucket for proof documents
INSERT INTO storage.buckets (id, name, public) VALUES ('proof-documents', 'proof-documents', false);

-- Create RLS policies for proof documents
CREATE POLICY "Users can view their own proof documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'proof-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own proof documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'proof-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own proof documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'proof-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own proof documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'proof-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create reports table to store restoration activity reports
CREATE TABLE public.reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    project_name TEXT NOT NULL,
    community_name TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    area_covered DECIMAL(10,2) NOT NULL,
    location_coordinates TEXT NOT NULL,
    estimated_credits INTEGER NOT NULL,
    actual_credits INTEGER,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
    proof_documents JSONB DEFAULT '[]'::jsonb,
    gps_data JSONB,
    description TEXT,
    verifier_id UUID,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reports
CREATE POLICY "Users can view their own reports" 
ON public.reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
ON public.reports 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admin policy for NCCR users (will be implemented when auth is set up)
CREATE POLICY "Admins can view all reports" 
ON public.reports 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update all reports" 
ON public.reports 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();