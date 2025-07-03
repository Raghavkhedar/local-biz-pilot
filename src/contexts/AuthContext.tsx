
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { Database } from '@/integrations/supabase/types';

type User = Database['public']['Tables']['users']['Row'];
type BusinessProfile = Database['public']['Tables']['business_profiles']['Row'];

interface AuthContextType {
  user: User | null;
  businessProfile: BusinessProfile | null;
  isAuthenticated: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);

          // Fetch business profile
          const { data: profileData } = await supabase
            .from('business_profiles')
            .select('*')
            .eq('user_id', userData.id)
            .single();

          if (profileData) {
            setBusinessProfile(profileData);
          }
        }
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);

          // Fetch business profile
          const { data: profileData } = await supabase
            .from('business_profiles')
            .select('*')
            .eq('user_id', userData.id)
            .single();

          if (profileData) {
            setBusinessProfile(profileData);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setBusinessProfile(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    try {
      // First, find the user with the given PIN
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('pin', pin)
        .single();

      if (userError || !userData) {
        console.log('User lookup error:', userError);
        return false;
      }

      // Create a session using Supabase auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${userData.id}@localbizpilot.internal`,
        password: pin
      });

      if (signInError) {
        console.log('Sign in error:', signInError);
        return false;
      }

      setUser(userData);
      setIsAuthenticated(true);

      // Fetch business profile
      const { data: profileData } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (profileData) {
        setBusinessProfile(profileData);
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setBusinessProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateBusinessProfile = async (profile: Partial<BusinessProfile>) => {
    if (!user || !businessProfile) return;

    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessProfile.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setBusinessProfile(data);
    } catch (error) {
      console.error('Update business profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    businessProfile,
    isAuthenticated,
    login,
    logout,
    updateBusinessProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
