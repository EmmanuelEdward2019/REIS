-- Migration: Ensure Admin User Exists
-- This ensures there's at least one admin user in the system with a proper email

-- First, try to update any existing user with admin-like email to be an admin
UPDATE public.profiles 
SET user_role = 'admin' 
WHERE (email ILIKE '%admin%' OR email ILIKE '%administrator%' OR email = 'techfieldstechnologies@gmail.com')
AND (user_role IS NULL OR user_role != 'admin');

-- If there's still no admin user, we'll create/update a specific admin user
-- This is a safeguard to ensure the system always has an admin
DO $$
DECLARE
    admin_exists BOOLEAN;
    first_user_id UUID;
BEGIN
    -- Check if any admin user exists
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE user_role = 'admin'
    ) INTO admin_exists;
    
    -- If no admin exists, create/update one
    IF NOT admin_exists THEN
        -- Try to find a user with admin-like email first
        SELECT id INTO first_user_id
        FROM public.profiles 
        WHERE email IS NOT NULL 
        AND (email ILIKE '%admin%' OR email ILIKE '%tech%')
        LIMIT 1;
        
        -- Update that user to be an admin if found
        IF first_user_id IS NOT NULL THEN
            UPDATE public.profiles 
            SET user_role = 'admin'
            WHERE id = first_user_id;
        END IF;
    END IF;
END $$;

-- Ensure all other users have a proper role
UPDATE public.profiles 
SET user_role = 'client' 
WHERE user_role IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.user_role IS 'User role for RBAC: client, partner, or admin. Admin users can manage the entire system.';
COMMENT ON COLUMN public.profiles.email IS 'User email address, synced from auth.users table';