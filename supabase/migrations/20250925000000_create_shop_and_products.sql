-- Migration: Create Shop, Products, Orders, and Payment tables
-- This enables the e-commerce functionality for the Eagle & Thistle platform

-- ============================================================================
-- DROP EXISTING TABLES (if they exist from failed migrations)
-- ============================================================================
DROP TABLE IF EXISTS public.product_reviews CASCADE;
DROP TABLE IF EXISTS public.payment_transactions CASCADE;
DROP TABLE IF EXISTS public.shopping_cart CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP SEQUENCE IF EXISTS order_number_seq CASCADE;

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- 'solar_panel', 'inverter', 'battery', 'controller', 'accessory', 'service'
  subcategory VARCHAR(100), -- 'residential', 'commercial', 'industrial'
  price_ngn DECIMAL(12, 2) NOT NULL, -- Price in Nigerian Naira
  price_gbp DECIMAL(12, 2), -- Price in British Pounds (optional, can be calculated)
  currency VARCHAR(3) DEFAULT 'NGN',
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  sku VARCHAR(100) UNIQUE,
  brand VARCHAR(100),
  specifications JSONB, -- Technical specs as JSON
  images JSONB, -- Array of image URLs
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  supplier_partner_id UUID, -- Partner who supplies this (FK added later)
  created_by UUID, -- User who created this (FK added later)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL, -- FK added later
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  payment_method VARCHAR(50), -- 'paystack', 'stripe', 'bank_transfer'
  payment_reference VARCHAR(255),
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) DEFAULT 0,
  shipping_fee DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  shipping_address JSONB, -- Full address as JSON
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  product_name VARCHAR(255) NOT NULL, -- Snapshot of product name at time of order
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SHOPPING CART TABLE
-- ============================================================================
CREATE TABLE public.shopping_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- FK added later
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================================================
-- PAYMENT TRANSACTIONS TABLE
-- ============================================================================
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  payment_gateway VARCHAR(50) NOT NULL, -- 'paystack', 'stripe'
  transaction_reference VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'success', 'failed'
  gateway_response JSONB, -- Full response from payment gateway
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRODUCT REVIEWS TABLE
-- ============================================================================
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL, -- FK added later
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON public.products(supplier_partner_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON public.product_reviews(product_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.shopping_cart
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER FOR ORDER NUMBER GENERATION
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER set_order_number BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Products: Everyone can view active products, only admins and suppliers can manage
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

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

-- Orders: Users can view their own orders, admins can view all
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own_or_admin" ON public.orders FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "orders_update_own_or_admin" ON public.orders FOR UPDATE
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

-- Order Items: Inherit from orders
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select" ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role = 'admin'
      ))
    )
  );

CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

-- Shopping Cart: Users can only access their own cart
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_all_own" ON public.shopping_cart
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Payment Transactions: Users can view their own, admins can view all
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_transactions_select" ON public.payment_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payment_transactions.order_id
      AND (orders.customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role = 'admin'
      ))
    )
  );

-- Product Reviews: Everyone can view, only verified purchasers can create
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all" ON public.product_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "reviews_insert_own" ON public.product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reviews_update_own" ON public.product_reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ============================================================================
-- Add foreign keys after tables are created to avoid circular dependency issues

-- Products table foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    -- Add FK for supplier_partner_id if profiles table exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'products_supplier_partner_id_fkey'
      AND table_name = 'products'
    ) THEN
      ALTER TABLE public.products
      ADD CONSTRAINT products_supplier_partner_id_fkey
      FOREIGN KEY (supplier_partner_id) REFERENCES public.profiles(user_id);
    END IF;

    -- Add FK for created_by if profiles table exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'products_created_by_fkey'
      AND table_name = 'products'
    ) THEN
      ALTER TABLE public.products
      ADD CONSTRAINT products_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES public.profiles(user_id);
    END IF;
  END IF;
END $$;

-- Orders table foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'orders_customer_id_fkey'
      AND table_name = 'orders'
    ) THEN
      ALTER TABLE public.orders
      ADD CONSTRAINT orders_customer_id_fkey
      FOREIGN KEY (customer_id) REFERENCES public.profiles(user_id);
    END IF;
  END IF;
END $$;

-- Shopping cart foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'shopping_cart_user_id_fkey'
      AND table_name = 'shopping_cart'
    ) THEN
      ALTER TABLE public.shopping_cart
      ADD CONSTRAINT shopping_cart_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Product reviews foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'product_reviews_user_id_fkey'
      AND table_name = 'product_reviews'
    ) THEN
      ALTER TABLE public.product_reviews
      ADD CONSTRAINT product_reviews_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);
    END IF;
  END IF;
END $$;

