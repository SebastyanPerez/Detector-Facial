import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || '';

// Initialize Supabase client
let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('Supabase URL and Key must be set in environment variables');
    }
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseClient;
};

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

export interface AuthService {
  signUp: (email: string, password: string, metadata?: { role?: string }) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  getCurrentUser: () => Promise<AuthUser | null>;
  getSession: () => Promise<{ access_token: string | null; error: Error | null }>;
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => () => void;
}

export const authService: AuthService = {
  /**
   * Sign up a new user with email and password
   */
  signUp: async (email: string, password: string, metadata?: { role?: string }) => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || { role: 'user' }
        }
      });

      if (error) {
        return { user: null, error };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || 'user'
        } : null,
        error: null
      };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { user: null, error };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || 'user'
        } : null,
        error: null
      };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'user'
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get the current session access token
   */
  getSession: async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { access_token: null, error };
      }

      return {
        access_token: session?.access_token || null,
        error: null
      };
    } catch (error) {
      return { access_token: null, error: error as Error };
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || 'user'
      } : null;
      callback(user);
    });

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  }
};
