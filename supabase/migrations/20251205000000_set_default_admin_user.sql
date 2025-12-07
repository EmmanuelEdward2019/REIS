-- Migration: Set Default Admin User
-- This ensures there's at least one admin user in the system

-- Create or update a default admin user
-- This assumes there's at least one user with 'admin' in their email
UPDATE public.profiles 
SET user_role = 'admin' 
WHERE email ILIKE '%admin%'
AND (user_role IS NULL OR user_role != 'admin');

-- If no admin user exists, we might need to create one manually
-- But for now, we'll rely on the application logic to handle this

-- Ensure all other users have a proper role
UPDATE public.profiles 
SET user_role = 'client' 
WHERE user_role IS NULL;

-- Add a comment for documentation
COMMENT ON COLUMN public.profiles.user_role IS 'User role for RBAC: client, partner, or admin. Admin users can manage the entire system.';