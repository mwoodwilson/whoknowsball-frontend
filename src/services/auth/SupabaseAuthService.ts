import 'react-native-url-polyfill/auto';
import { createClient, AuthError, User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: AuthError | Error | null;
}

class SupabaseAuthService {
  /**
   * Sign up a new user with email and password
   * @param metadata Optional user metadata (e.g., username) to store in user profile
   */
  async signUp(email: string, password: string, metadata?: Record<string, any>): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: metadata ? {
          data: metadata,
        } : undefined,
      });

      if (error) {
        return this.handleAuthError(error);
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Sign in with OAuth provider (Google or Apple)
   */
  async signInWithOAuth(provider: 'google' | 'apple'): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'whoknowsball://auth/callback',
        },
      });

      if (error) {
        return this.handleAuthError(error);
      }

      return {
        user: data.session?.user ?? null,
        session: data.session,
        error: null,
      };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Sign in an existing user with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return this.handleAuthError(error);
      }

      // Check email verification status
      const emailVerified = this.checkEmailVerified(data.user);

      if (!emailVerified) {
        const isExpired = this.isAccountExpired(data.user);

        if (isExpired) {
          // Account is >24h old and not verified - reject login
          await supabase.auth.signOut(); // Sign them out immediately
          return {
            error: new Error('Account disabled. Please verify your email or create a new account.'),
          };
        }
        // Account is <24h old and not verified - allow login but flag
        console.warn(`User ${email} logged in without email verification. Hours remaining: ${this.getHoursUntilExpiration(data.user).toFixed(1)}`);
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        error: error as Error,
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error?: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<{ session: Session | null; error?: Error | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Get session error:', error);
        return { session: null, error };
      }

      return { session: data.session, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { session: null, error: error as Error };
    }
  }

  /**
   * Get the current user
   */
  async getUser(): Promise<{ user: User | null; error?: Error | null }> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Get user error:', error);
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Get user error:', error);
      return { user: null, error: error as Error };
    }
  }

  /**
   * Handle common Supabase auth errors with user-friendly messages
   */
  private handleAuthError(error: AuthError): AuthResponse {
    let userMessage: string;

    switch (error.message) {
      case 'Invalid login credentials':
        userMessage = 'Invalid email, username, or password. Please try again.';
        break;
      case 'Email not confirmed':
        userMessage = 'Please verify your email address before signing in.';
        break;
      case 'User already registered':
        userMessage = 'An account with this email already exists.';
        break;
      case 'Password should be at least 6 characters':
        userMessage = 'Password must be at least 6 characters long.';
        break;
      case 'Invalid email':
        userMessage = 'Please enter a valid email address or username.';
        break;
      default:
        userMessage = error.message || 'An error occurred. Please try again.';
    }

    return {
      error: new Error(userMessage),
    };
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ error?: Error | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        console.error('Resend verification error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Resend verification error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Check if user's email is verified
   */
  checkEmailVerified(user: User | null): boolean {
    if (!user) return false;
    return user.email_confirmed_at !== null && user.email_confirmed_at !== undefined;
  }

  /**
   * Check if account is expired (>24h old and email not verified)
   */
  isAccountExpired(user: User | null): boolean {
    if (!user || !user.created_at) return false;

    const createdAt = new Date(user.created_at);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    const emailVerified = this.checkEmailVerified(user);

    return hoursSinceCreation > 24 && !emailVerified;
  }

  /**
   * Get hours remaining until account expiration
   */
  getHoursUntilExpiration(user: User | null): number {
    if (!user || !user.created_at) return 0;

    const createdAt = new Date(user.created_at);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    return Math.max(0, 24 - hoursSinceCreation);
  }
}

export default new SupabaseAuthService();
