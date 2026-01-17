// Backend proxy - No Supabase credentials needed on frontend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Helper to get auth token from localStorage
const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper to store auth token
const storeToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Helper to clear auth token
const clearToken = (): void => {
  localStorage.removeItem('auth_token');
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
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          metadata: metadata || { role: 'user' }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { user: null, error: new Error(errorData.detail || 'Sign up failed') };
      }

      const data = await response.json();
      
      // Store token if provided
      if (data.access_token) {
        storeToken(data.access_token);
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role || 'user'
        },
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
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { user: null, error: new Error(errorData.detail || 'Sign in failed') };
      }

      const data = await response.json();
      
      // Store token
      storeToken(data.access_token);

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role || 'user'
        },
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
      const token = getStoredToken();
      
      if (token) {
        await fetch(`${BACKEND_URL}/api/v1/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      clearToken();
      return { error: null };
    } catch (error) {
      clearToken();
      return { error: error as Error };
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async () => {
    try {
      const token = getStoredToken();
      
      if (!token) {
        return null;
      }

      const response = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        clearToken();
        return null;
      }

      const data = await response.json();
      return {
        id: data.id,
        email: data.email,
        role: data.role || 'user'
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
      const token = getStoredToken();
      
      if (!token) {
        return { access_token: null, error: null };
      }

      // Verify token is still valid
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        clearToken();
        return { access_token: null, error: new Error('Token expired') };
      }

      return { access_token: token, error: null };
    } catch (error) {
      return { access_token: null, error: error as Error };
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
    // Check initial auth state
    const checkAuth = async () => {
      const user = await authService.getCurrentUser();
      callback(user);
    };

    checkAuth();

    // Set up polling to check auth state (every 5 minutes)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    // Also check when storage changes (logout from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    // Return unsubscribe function
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }
};
