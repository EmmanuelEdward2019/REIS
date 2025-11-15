-- Add supplier_partner_id column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS supplier_partner_id UUID REFERENCES public.partner_applications(id) ON DELETE SET NULL;

-- Add approval status and notes
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS approval_notes TEXT;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Add source to track where product came from
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'admin' CHECK (source IN ('admin', 'partner', 'import'));

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_products_supplier_partner_id ON public.products(supplier_partner_id);
CREATE INDEX IF NOT EXISTS idx_products_approval_status ON public.products(approval_status);
CREATE INDEX IF NOT EXISTS idx_products_source ON public.products(source);

-- Add comments
COMMENT ON COLUMN public.products.supplier_partner_id IS 'Partner who supplies this product (if applicable)';
COMMENT ON COLUMN public.products.approval_status IS 'Admin approval status for partner-submitted products';
COMMENT ON COLUMN public.products.approval_notes IS 'Admin notes about approval/rejection';
COMMENT ON COLUMN public.products.approved_by IS 'Admin user who approved/rejected the product';
COMMENT ON COLUMN public.products.approved_at IS 'Timestamp when product was approved/rejected';
COMMENT ON COLUMN public.products.source IS 'Source of product: admin (manually added), partner (from partner application), import (bulk import)';

-- Create view for pending partner products
CREATE OR REPLACE VIEW public.pending_partner_products AS
SELECT
  p.*,
  pa.legal_name as company_name,
  pa.first_name || ' ' || pa.last_name as contact_person,
  pa.email,
  pa.phone as phone_number,
  prof.full_name as partner_name
FROM public.products p
LEFT JOIN public.partner_applications pa ON p.supplier_partner_id = pa.id
LEFT JOIN public.profiles prof ON pa.user_id = prof.user_id
WHERE p.approval_status = 'pending' AND p.source = 'partner';

-- Grant access to view
GRANT SELECT ON public.pending_partner_products TO authenticated;

-- Update RLS policies for products table
-- Allow partners to insert their own products (pending approval)
CREATE POLICY "Partners can insert their own products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.partner_applications pa
    WHERE pa.user_id = auth.uid()
    AND pa.id = products.supplier_partner_id
  )
);

-- Allow partners to view their own products
CREATE POLICY "Partners can view their own products"
ON public.products
FOR SELECT
TO authenticated
USING (
  supplier_partner_id IN (
    SELECT id FROM public.partner_applications
    WHERE user_id = auth.uid()
  )
  OR is_active = true -- Everyone can see active products
);

-- Allow partners to update their own products (except approval fields)
CREATE POLICY "Partners can update their own products"
ON public.products
FOR UPDATE
TO authenticated
USING (
  supplier_partner_id IN (
    SELECT id FROM public.partner_applications
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  supplier_partner_id IN (
    SELECT id FROM public.partner_applications
    WHERE user_id = auth.uid()
  )
);

-- Allow admins to update any product
CREATE POLICY "Admins can update any product"
ON public.products
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Allow admins to delete any product
CREATE POLICY "Admins can delete any product"
ON public.products
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

