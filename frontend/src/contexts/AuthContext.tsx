import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signUp: (email: string, password: string, metadata?: { role?: string }) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signInAsGuest: () => void;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isDemo, setIsDemo] = useState(() => localStorage.getItem('demo_mode') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If in demo mode, don't check real auth
    if (isDemo) {
      setUser({
        id: 'demo-user',
        email: 'guest@demo.com',
        role: 'admin',
        sub: 'demo-org'
      });
      setLoading(false);
      return;
    }

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
      if (!isDemo) {
        setUser(currentUser);
      }
    });

    return unsubscribe;
  }, [isDemo]);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.user) {
      setUser(result.user);
      setIsDemo(false);
      localStorage.removeItem('demo_mode');
    }
    return result;
  };

  const signInAsGuest = () => {
    setIsDemo(true);
    localStorage.setItem('demo_mode', 'true');
    setUser({
      id: 'demo-user',
      email: 'guest@demo.com',
      role: 'admin',
      sub: 'demo-org'
    });
  };

  const signUp = async (email: string, password: string, metadata?: { role?: string }) => {
    const result = await authService.signUp(email, password, metadata);
    if (result.user) {
      setUser(result.user);
      setIsDemo(false);
      localStorage.removeItem('demo_mode');
    }
    return result;
  };

  const signOut = async () => {
    if (isDemo) {
      setIsDemo(false);
      localStorage.removeItem('demo_mode');
      setUser(null);
      return { error: null };
    }
    const result = await authService.signOut();
    if (!result.error) {
      setUser(null);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signIn, signUp, signInAsGuest, signOut }}>
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
