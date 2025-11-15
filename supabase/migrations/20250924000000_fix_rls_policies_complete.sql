-- Complete fix for RLS policies to resolve 406 errors
-- This migration completely removes all conflicting policies and creates clean, simple ones

-- Step 1: Disable RLS temporarily to clean up
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies on profiles (including any from previous migrations)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.profiles';
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, working policies
-- Policy 1: All authenticated users can view all profiles
CREATE POLICY "allow_authenticated_select" 
ON public.profiles FOR SELECT 
TO authenticated
USING (true);

-- Policy 2: Users can update only their own profile
CREATE POLICY "allow_own_update" 
ON public.profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can insert only their own profile
CREATE POLICY "allow_own_insert" 
ON public.profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Step 5: Verify the trigger exists for auto-creating profiles
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Grant necessary permissions
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
GRANT INSERT ON public.profiles TO authenticated;

