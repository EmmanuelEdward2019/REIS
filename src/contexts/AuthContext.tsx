import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  user_role: 'client' | 'partner' | 'admin';
  service_class: 'residential' | 'commercial' | 'industrial' | null;
  partner_category: string | null;
  is_verified: boolean;
  verification_type: string | null;
  verification_id: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>; // Add refreshProfile to the interface
  isAdmin: boolean;
  isPartner: boolean;
  isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Function to manually refresh the profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      // Try to get all columns first
      let result = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If that fails, try a more basic query
      if (result.error) {
        console.error('Supabase error with full select:', result.error);
        console.log('Trying basic profile query...');

        result = await supabase
          .from('profiles')
          .select('id,user_id,full_name,company_name,phone,email,service_class,partner_category,is_verified,verification_type,verification_id,created_at,updated_at')
          .eq('user_id', userId)
          .single();

        if (result.error) {
          console.error('Supabase error with basic select:', result.error);
          throw result.error;
        }
      }

      const { data, error } = result;

      console.log('Profile fetched successfully:', data);
      // Ensure all required fields are present
      if (data) {
        // Handle case where user_role might not exist in older profiles
        let userRole = (data as any).user_role || 'client';

        // Log the user role for debugging
        console.log('User role from profile:', userRole);

        console.log('User role detected:', userRole);

        setProfile({
          id: data.id,
          user_id: data.user_id,
          full_name: data.full_name,
          company_name: data.company_name,
          phone: data.phone,
          email: (data as any).email || null,
          user_role: userRole as 'client' | 'partner' | 'admin',
          service_class: data.service_class as 'residential' | 'commercial' | 'industrial' | null,
          partner_category: data.partner_category,
          is_verified: data.is_verified,
          verification_type: data.verification_type,
          verification_id: data.verification_id,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Even if we can't fetch the full profile, create a minimal one to allow login
      // This is a fallback to prevent users from being stuck
      console.log('Creating minimal profile for user:', userId);
      setProfile({
        id: '',
        user_id: userId,
        full_name: null,
        company_name: null,
        phone: null,
        email: null,
        user_role: 'client',
        service_class: null,
        partner_category: null,
        is_verified: false,
        verification_type: null,
        verification_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        // Wait for profile fetch to complete to ensure we have the correct user role
        // This prevents redirect issues where the user gets sent to the wrong dashboard
        try {
          await fetchProfile(data.user.id);
        } catch (err) {
          console.error('Profile fetch failed:', err);
          // Even if profile fetch fails, we still want to allow login
          // The useEffect in Auth.tsx will handle redirect with fallback logic
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) return { error: authError };

      // Update profile with additional user data
      // Note: The profile is automatically created by a database trigger
      // We just need to update it with the user's information
      if (authData.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: userData.full_name,
            company_name: userData.company_name,
            phone: userData.phone,
            user_role: userData.user_role || 'client',
            service_class: userData.service_class,
            partner_category: userData.partner_category,
          })
          .eq('user_id', authData.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          // Don't fail the signup just because we couldn't update the profile
        }

        // Fetch the updated profile
        fetchProfile(authData.user.id).catch(err => {
          console.error('Profile fetch failed after signup:', err);
        });
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) return { error };

      // Refresh profile
      await fetchProfile(user.id);

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const isAdmin = profile?.user_role === 'admin';
  const isPartner = profile?.user_role === 'partner';
  const isClient = profile?.user_role === 'client';

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile, // Add the refreshProfile function
    isAdmin,
    isPartner,
    isClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

