-- Migration: Fix Default Admin User Role
-- This ensures the default admin user has the correct user_role set

-- Update any existing profile with a known admin email to have user_role = 'admin'
-- Replace 'admin@eagleandthistle.com' with the actual default admin email
UPDATE public.profiles 
SET user_role = 'admin' 
WHERE email ILIKE '%admin%' 
AND user_role != 'admin';

-- Also update any profile that might have been created without a user_role
UPDATE public.profiles 
SET user_role = 'client' 
WHERE user_role IS NULL;

-- Make sure the email column exists and has proper values
UPDATE public.profiles 
SET email = (SELECT email FROM auth.users WHERE id = profiles.user_id)
WHERE email IS NULL AND user_id IS NOT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN public.profiles.user_role IS 'User role for RBAC: client, partner, or admin';