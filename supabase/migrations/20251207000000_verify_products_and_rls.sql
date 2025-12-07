-- Migration: Verify Products Table and RLS Policies
-- This ensures the products table and RLS policies are correctly configured

-- Ensure products table exists with correct structure
DO $$
BEGIN
    -- Check if products table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
        -- Ensure all required columns exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'name') THEN
            ALTER TABLE public.products ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT '';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category') THEN
            ALTER TABLE public.products ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT '';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'price_ngn') THEN
            ALTER TABLE public.products ADD COLUMN price_ngn DECIMAL(12, 2) NOT NULL DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_active') THEN
            ALTER TABLE public.products ADD COLUMN is_active BOOLEAN DEFAULT true;
        END IF;
    END IF;
END $$;

-- Recreate products RLS policies to ensure they're correct
-- Drop existing policies first
DROP POLICY IF EXISTS "products_select_all" ON public.products;
DROP POLICY IF EXISTS "products_insert_admin_supplier" ON public.products;
DROP POLICY IF EXISTS "products_update_admin_supplier" ON public.products;

-- Create proper products policies
CREATE POLICY "products_select_all" ON public.products FOR SELECT
  TO authenticated
  USING (is_active = true OR created_by = auth.uid());

CREATE POLICY "products_insert_admin_supplier" ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND user_role IN ('admin', 'partner')
    )
  );

CREATE POLICY "products_update_admin_supplier" ON public.products FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    supplier_partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Verify that we have products in the table
-- If no products exist, insert sample data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.products LIMIT 1) THEN
        -- Insert sample products if none exist
        INSERT INTO public.products (name, description, category, subcategory, price_ngn, price_gbp, brand, sku, stock_quantity, is_active, is_featured, specifications, images) VALUES
        (
            'Sample Solar Panel',
            'High-efficiency solar panel for residential use',
            'solar_panel',
            'residential',
            150000,
            250,
            'Sample Brand',
            'SP-001',
            50,
            true,
            true,
            '{"power": "400W", "efficiency": "20.5%"}'::jsonb,
            '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800"]'::jsonb
        );
    END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON public.products(created_by);

-- Add comments for documentation
COMMENT ON TABLE public.products IS 'Products available in the shop. Contains solar panels, inverters, batteries, and related equipment.';
COMMENT ON COLUMN public.products.is_active IS 'Whether this product is available for purchase';
COMMENT ON COLUMN public.products.is_featured IS 'Whether this product should be highlighted in the shop';
COMMENT ON POLICY "products_select_all" ON public.products IS 'Everyone can view active products, creators can view their own inactive products';