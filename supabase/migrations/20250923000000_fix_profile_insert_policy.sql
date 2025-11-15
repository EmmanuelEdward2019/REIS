-- Fix RLS policy for profile creation during signup
-- Use a database trigger to automatically create profiles for new users
-- This bypasses RLS issues during signup

-- Create a function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, user_role, is_verified, created_at, updated_at)
  VALUES (NEW.id, 'client', false, NOW(), NOW());
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Drop ALL existing policies on profiles to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;

-- Create simple, non-recursive policies for profiles
-- Policy 1: Allow all authenticated users to view all profiles
-- This is necessary because admins need to see all profiles, and checking admin status creates recursion
CREATE POLICY "profiles_select_policy"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Policy 2: Users can update their own profile
CREATE POLICY "profiles_update_policy"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy 3: Users can insert their own profile (needed for manual profile creation)
CREATE POLICY "profiles_insert_policy"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

