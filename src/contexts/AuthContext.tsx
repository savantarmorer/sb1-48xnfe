import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, UserRole } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the hook as a named const
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the provider as a named const
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    // Check active session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          await loadUserProfile(session.user.id);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          console.error('Error initializing auth:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        try {
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
          }
        } catch (err) {
          setError(err as Error);
          console.error('Error in auth state change:', err);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      setError(null);
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError;
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        const { data: authUser } = await supabase.auth.getUser();
        const defaultProfile = {
          id: userId,
          email: authUser.user?.email || '',
          name: 'User',
          roles: ['user'],
          level: 1,
          xp: 0,
          coins: 0,
          streak: 0,
          battle_rating: 1000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile);

        if (insertError) throw insertError;
      }

      // Now fetch the profile (either existing or newly created)
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      if (!profile) {
        throw new Error('Failed to load profile after creation');
      }

      const userRoles = Array.isArray(profile.roles) 
        ? profile.roles as UserRole[]
        : ['user'] as UserRole[];

      setUser({
        id: userId,
        email: profile.email || '',
        name: profile.name || 'User',
        roles: userRoles,
        level: profile.level || 1,
        xp: profile.xp || 0,
        coins: profile.coins || 0,
        streak: profile.streak || 0,
        battleRating: profile.battle_rating || 1000,
        avatar_url: profile.avatar_url || null,
        title: profile.title || null
      });
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err as Error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error: authError };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};