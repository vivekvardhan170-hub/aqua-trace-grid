-- Fix storage RLS for proof uploads to work with current Clerk-based auth on the frontend
-- Strategy: allow INSERTs to the 'proof-documents' bucket for both anon and authenticated roles.

-- 1) Create INSERT policy for proof-documents bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow uploads to proof-documents for clients'
  ) THEN
    CREATE POLICY "Allow uploads to proof-documents for clients"
    ON storage.objects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'proof-documents');
  END IF;
END
$$;

-- 2) Create SELECT policy for proof-documents bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow read access to proof-documents for clients'
  ) THEN
    CREATE POLICY "Allow read access to proof-documents for clients"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'proof-documents');
  END IF;
END
$$;