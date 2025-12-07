-- Migration: Fix RLS Recursion Issues
-- This resolves the infinite recursion detected in policy for profiles table

-- Drop existing recursive policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Create non-recursive policies for profiles
-- Policy 1: Allow all authenticated users to view all profiles
-- This avoids recursion by not checking admin status within the same table
CREATE POLICY "profiles_select_policy"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Policy 2: Users can update their own profile
CREATE POLICY "profiles_update_policy"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy 3: Admins can insert profiles (using JWT claims to avoid recursion)
CREATE POLICY "profiles_insert_admin_policy"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (
    -- Check if user has admin role in JWT claims
    COALESCE(current_setting('request.jwt.claims', true)::json->>'user_role', '') = 'admin'
);

-- Policy 4: Admins can update all profiles (using JWT claims to avoid recursion)
CREATE POLICY "profiles_update_admin_policy"
ON public.profiles FOR UPDATE
TO authenticated
USING (
    -- Check if user has admin role in JWT claims
    COALESCE(current_setting('request.jwt.claims', true)::json->>'user_role', '') = 'admin'
);

-- Policy 5: Admins can delete profiles (using JWT claims to avoid recursion)
CREATE POLICY "profiles_delete_admin_policy"
ON public.profiles FOR DELETE
TO authenticated
USING (
    -- Check if user has admin role in JWT claims
    COALESCE(current_setting('request.jwt.claims', true)::json->>'user_role', '') = 'admin'
);

-- Also fix products RLS policy to ensure it works correctly
-- Drop existing products policies
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

-- Add comments for documentation
COMMENT ON POLICY "profiles_select_policy" ON public.profiles IS 'Allow all authenticated users to view all profiles (avoids recursion)';
COMMENT ON POLICY "profiles_update_policy" ON public.profiles IS 'Users can update their own profile';
COMMENT ON POLICY "profiles_insert_admin_policy" ON public.profiles IS 'Admins can insert profiles (uses JWT claims to avoid recursion)';
COMMENT ON POLICY "products_select_all" ON public.products IS 'Everyone can view active products, creators can view their own';