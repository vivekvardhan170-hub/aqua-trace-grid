-- Fix storage RLS for proof uploads to work with current Clerk-based auth on the frontend
-- Strategy: allow INSERTs to the 'proof-documents' bucket for both anon and authenticated roles.
-- This unblocks uploads while we later align Supabase auth with Clerk for per-user ownership rules.

-- 1) Create INSERT policy (idempotent):
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow uploads to proof-documents for clients'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Allow uploads to proof-documents for clients"
      ON storage.objects
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (bucket_id = 'proof-documents');
    $$;
  END IF;
END
$$;

-- 2) (Optional hardening) Ensure SELECT works for clients for this bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow read access to proof-documents for clients'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Allow read access to proof-documents for clients"
      ON storage.objects
      FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'proof-documents');
    $$;
  END IF;
END
$$;

-- 3) (Optional) Keep previous per-user policies if present; they will coexist and not interfere
-- No drops are performed to avoid breaking existing rules.

-- NOTE: For production, you likely want to tighten these policies to require Supabase-authenticated users only:
-- Example stricter policy (replace the INSERT policy above when Supabase auth is in place):
--   CREATE POLICY "Authenticated users can upload proof documents"
--   ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'proof-documents');
-- And optionally restrict to a per-user folder if using Supabase auth UUIDs:
--   WITH CHECK (
--     bucket_id = 'proof-documents'
--     AND (storage.foldername(name))[1] = auth.uid()::text
--   );