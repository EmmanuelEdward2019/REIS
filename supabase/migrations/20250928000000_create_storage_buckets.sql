-- Migration: Create Storage Buckets for File Uploads
-- This enables file upload functionality for partner documents, product images, etc.

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- Partner Documents Bucket (for partner applications, certifications, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'partner-documents',
  'partner-documents',
  true,
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Product Images Bucket (for shop product images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Client Documents Bucket (for client uploads, bills, audits, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-documents',
  'client-documents',
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Partner Documents Policies
-- Allow authenticated users to upload to their own folder
CREATE POLICY "partner_documents_upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'partner-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to read their own documents
CREATE POLICY "partner_documents_select" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'partner-documents' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role = 'admin'
      )
    )
  );

-- Allow users to delete their own documents
CREATE POLICY "partner_documents_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'partner-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Product Images Policies
-- Allow partners and admins to upload product images
CREATE POLICY "product_images_upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role IN ('partner', 'admin')
    )
  );

-- Allow everyone to view product images (public bucket)
CREATE POLICY "product_images_select" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Allow partners and admins to delete product images
CREATE POLICY "product_images_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role IN ('partner', 'admin')
    )
  );

-- Client Documents Policies
-- Allow clients to upload to their own folder
CREATE POLICY "client_documents_upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'client-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow clients to read their own documents, admins can read all
CREATE POLICY "client_documents_select" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'client-documents' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
      )
    )
  );

-- Allow clients to delete their own documents
CREATE POLICY "client_documents_delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'client-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

