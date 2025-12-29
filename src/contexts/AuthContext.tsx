import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import SupabaseAuthService, { supabase } from '../services/auth/SupabaseAuthService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signInWithGoogle: () => Promise<{ needsUsername: boolean }>;
  signInWithApple: () => Promise<{ needsUsername: boolean }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  accountExpired: boolean;
  resendVerificationEmail: () => Promise<void>;
  checkVerificationStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [accountExpired, setAccountExpired] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    loadSession();

    // Listen to auth state changes
    const { data: authListener } = SupabaseAuthService.onAuthStateChange((session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const updateVerificationStatus = (currentUser: User | null) => {
    if (!currentUser) {
      setIsEmailVerified(false);
      setAccountExpired(false);
      return;
    }

    // Check if email is verified
    const verified = SupabaseAuthService.checkEmailVerified(currentUser);
    setIsEmailVerified(verified);

    // Check if account is expired (>24h old and not verified)
    const expired = SupabaseAuthService.isAccountExpired(currentUser);
    setAccountExpired(expired);
  };

  const loadSession = async () => {
    try {
      setLoading(true);
      const { session, error } = await SupabaseAuthService.getSession();

      if (error) {
        console.error('Error loading session:', error);
        setUser(null);
        updateVerificationStatus(null);
      } else {
        setUser(session?.user ?? null);
        updateVerificationStatus(session?.user ?? null);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      setUser(null);
      updateVerificationStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (identifier: string, password: string): Promise<void> => {
    try {
      setLoading(true);

      let email = identifier;

      // Check if identifier is email (contains @) or username
      if (!identifier.includes('@')) {
        // It's a username - query users table to get email
        const { data, error: queryError } = await supabase
          .from('users')
          .select('email')
          .eq('username', identifier)
          .single();

        if (queryError || !data) {
          throw new Error('Username not found');
        }

        email = data.email;
      }

      // Now login with email
      const { user: signedInUser, error } = await SupabaseAuthService.signIn(email, password);

      if (error) {
        throw error;
      }

      setUser(signedInUser ?? null);
      updateVerificationStatus(signedInUser ?? null);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>): Promise<void> => {
    try {
      setLoading(true);
      const { user: newUser, error } = await SupabaseAuthService.signUp(email, password, metadata);

      if (error) {
        throw error;
      }

      setUser(newUser ?? null);
      updateVerificationStatus(newUser ?? null);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ needsUsername: boolean }> => {
    try {
      setLoading(true);
      const { data, error } = await SupabaseAuthService.signInWithOAuth('google');

      if (error) {
        throw error;
      }

      // After successful OAuth, check if user has username
      const { user: currentUser } = await SupabaseAuthService.getUser();
      if (currentUser) {
        setUser(currentUser);
        updateVerificationStatus(currentUser);

        // Check if user needs to set up username
        const hasUsername = currentUser.user_metadata?.username;
        return { needsUsername: !hasUsername };
      }

      return { needsUsername: false };
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithApple = async (): Promise<{ needsUsername: boolean }> => {
    try {
      setLoading(true);
      const { data, error } = await SupabaseAuthService.signInWithOAuth('apple');

      if (error) {
        throw error;
      }

      // After successful OAuth, check if user has username
      const { user: currentUser } = await SupabaseAuthService.getUser();
      if (currentUser) {
        setUser(currentUser);
        updateVerificationStatus(currentUser);

        // Check if user needs to set up username
        const hasUsername = currentUser.user_metadata?.username;
        return { needsUsername: !hasUsername };
      }

      return { needsUsername: false };
    } catch (error) {
      console.error('Apple sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await SupabaseAuthService.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      updateVerificationStatus(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    if (!user || !user.email) {
      throw new Error('No user email found');
    }

    try {
      const { error } = await SupabaseAuthService.resendVerificationEmail(user.email);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  };

  const checkVerificationStatus = async (): Promise<void> => {
    try {
      const { user: refreshedUser, error } = await SupabaseAuthService.getUser();

      if (error) {
        console.error('Error refreshing user:', error);
        throw error;
      }

      setUser(refreshedUser);
      updateVerificationStatus(refreshedUser);
    } catch (error) {
      console.error('Error checking verification status:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    isAuthenticated: user !== null,
    isEmailVerified,
    accountExpired,
    resendVerificationEmail,
    checkVerificationStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
