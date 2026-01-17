import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signUp: (email: string, password: string, metadata?: { role?: string }) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    authService.getCurrentUser().then(currentUser => {
      setUser(currentUser);
      setLoading(false);
    }).catch(err => {
      console.error('Error getting current user:', err);
      setLoading(false);
    });

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const signUp = async (email: string, password: string, metadata?: { role?: string }) => {
    const result = await authService.signUp(email, password, metadata);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const signOut = async () => {
    const result = await authService.signOut();
    if (!result.error) {
      setUser(null);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
