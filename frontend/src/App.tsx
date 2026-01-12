import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { EnhancedLandingPage } from './components/EnhancedLandingPage';
import { EnhancedDashboard } from './components/EnhancedDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <ThemeProvider>
      <div className="w-full h-screen">
        {currentView === 'landing' ? (
          <EnhancedLandingPage onNavigateToDashboard={() => setCurrentView('dashboard')} />
        ) : (
          <EnhancedDashboard onNavigateToLanding={() => setCurrentView('landing')} />
        )}
      </div>
    </ThemeProvider>
  );
}