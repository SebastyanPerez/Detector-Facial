import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EnhancedLandingPage } from './components/EnhancedLandingPage';
import { EnhancedDashboard } from './components/EnhancedDashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Auto-navigate to dashboard if user is logged in
  useEffect(() => {
    if (!loading && user) {
      setCurrentView('dashboard');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
          <p className="mt-4 text-[var(--foreground-secondary)]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      {currentView === 'landing' ? (
        <EnhancedLandingPage onNavigateToDashboard={() => setCurrentView('dashboard')} />
      ) : (
        <EnhancedDashboard onNavigateToLanding={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}