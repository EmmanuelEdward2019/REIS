-- Add user_role column to profiles table for role-based access control
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_role TEXT CHECK (user_role IN ('client', 'partner', 'admin')) DEFAULT 'client';

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);

-- Update RLS policies to include admin access
-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Admins can update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Admins can view all controllers
DROP POLICY IF EXISTS "Admins can view all controllers" ON public.controllers;
CREATE POLICY "Admins can view all controllers"
ON public.controllers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Admins can manage all controllers
DROP POLICY IF EXISTS "Admins can manage all controllers" ON public.controllers;
CREATE POLICY "Admins can manage all controllers"
ON public.controllers FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Admins can view all tickets
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;
CREATE POLICY "Admins can view all tickets"
ON public.tickets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Admins can manage all tickets
DROP POLICY IF EXISTS "Admins can manage all tickets" ON public.tickets;
CREATE POLICY "Admins can manage all tickets"
ON public.tickets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Partners can view tickets assigned to them
DROP POLICY IF EXISTS "Partners can view assigned tickets" ON public.tickets;
CREATE POLICY "Partners can view assigned tickets"
ON public.tickets FOR SELECT
USING (
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'partner'
  )
);

-- Partners can update assigned tickets
DROP POLICY IF EXISTS "Partners can update assigned tickets" ON public.tickets;
CREATE POLICY "Partners can update assigned tickets"
ON public.tickets FOR UPDATE
USING (assigned_to = auth.uid());

-- Admins can view all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Admins can manage all orders
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
CREATE POLICY "Admins can manage all orders"
ON public.orders FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Partners can view orders assigned to them
DROP POLICY IF EXISTS "Partners can view their orders" ON public.orders;
CREATE POLICY "Partners can view their orders"
ON public.orders FOR SELECT
USING (
  partner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'partner'
  )
);

-- Update admin policies for warehouse, suppliers, purchase orders, stock movements, BOMs
-- These were previously set to false, now allow admins

DROP POLICY IF EXISTS "Only admins can manage warehouses" ON public.warehouses;
CREATE POLICY "Admins can manage warehouses" 
ON public.warehouses FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_role = 'admin'
  )
);

DROP POLICY IF EXISTS "Only admins can manage suppliers" ON public.suppliers;
CREATE POLICY "Admins can manage suppliers" 
ON public.suppliers FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_role = 'admin'
  )
);

DROP POLICY IF EXISTS "Only admins can manage POs" ON public.purchase_orders;
CREATE POLICY "Admins can manage POs" 
ON public.purchase_orders FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_role = 'admin'
  )
);

DROP POLICY IF EXISTS "Only admins can manage PO items" ON public.purchase_order_items;
CREATE POLICY "Admins can manage PO items" 
ON public.purchase_order_items FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_role = 'admin'
  )
);

DROP POLICY IF EXISTS "Only admins can manage stock movements" ON public.stock_movements;
CREATE POLICY "Admins can manage stock movements" 
ON public.stock_movements FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_role = 'admin'
  )
);

DROP POLICY IF EXISTS "Only admins can manage BOMs" ON public.boms;
CREATE POLICY "Admins can manage BOMs" 
ON public.boms FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_role = 'admin'
  )
);

DROP POLICY IF EXISTS "Only admins can manage BOM items" ON public.bom_items;
CREATE POLICY "Admins can manage BOM items" 
ON public.bom_items FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND user_role = 'admin'
  )
);

-- Partners can manage their own products
DROP POLICY IF EXISTS "Partners can manage their products" ON public.products;
CREATE POLICY "Partners can manage their products"
ON public.products FOR ALL
USING (
  partner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role IN ('partner', 'admin')
  )
);

-- All authenticated users can view active products
DROP POLICY IF EXISTS "Users can view active products" ON public.products;
CREATE POLICY "Users can view active products"
ON public.products FOR SELECT
USING (is_active = true OR auth.uid() = partner_id);

