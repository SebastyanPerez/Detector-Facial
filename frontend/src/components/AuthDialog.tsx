import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { authService } from '../services/auth';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: () => void;
}

type AuthMode = 'login' | 'register';

export function AuthDialog({ open, onOpenChange, onAuthSuccess }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
  };

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        // Validate password confirmation
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setIsLoading(false);
          return;
        }

        // Register with admin role for demo access
        const { user, error } = await authService.signUp(email, password, { role: 'admin' });

        if (error) {
          setError(error.message || 'Error al registrar usuario');
          setIsLoading(false);
          return;
        }

        if (user) {
          setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
          // Switch to login mode after successful registration
          setTimeout(() => {
            handleModeSwitch('login');
            setSuccess('Inicia sesión con tus credenciales');
          }, 2000);
        }
      } else {
        // Login
        const { user, error } = await authService.signIn(email, password);

        if (error) {
          setError(error.message || 'Error al iniciar sesión');
          setIsLoading(false);
          return;
        }

        if (user) {
          setSuccess('¡Inicio de sesión exitoso!');
          // Close dialog and trigger success callback
          setTimeout(() => {
            onOpenChange(false);
            resetForm();
            if (onAuthSuccess) {
              onAuthSuccess();
            }
          }, 1000);
        }
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl p-6 sm:p-8">
        {/* Header mejorado */}
        <DialogHeader className="space-y-4 mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--primary)]/10 mx-auto mb-3">
            <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15 6V12L9 16L3 12V6L9 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-[var(--primary)]"/>
            </svg>
          </div>
          <div className="text-center">
            <DialogTitle className="text-3xl sm:text-3xl font-bold text-[var(--foreground)]">
              {mode === 'login' ? 'Bienvenido de Vuelta' : 'Crear Cuenta'}
            </DialogTitle>
            <DialogDescription className="text-base text-[var(--foreground-secondary)] mt-2">
              {mode === 'login'
                ? 'Accede a tu panel de control'
                : 'Crea una nueva cuenta de administrador'}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alerts mejorados */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--destructive-bg)] border border-[var(--destructive-border)]">
              <AlertCircle className="h-5 w-5 text-[var(--destructive)] flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-[var(--destructive)]">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--success-bg)] border border-[var(--success-border)]">
              <AlertCircle className="h-5 w-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-[var(--success)]">{success}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-[var(--foreground)] block">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
              className="h-12 text-base px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none transition-all bg-[var(--input-background)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold text-[var(--foreground)] block">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="h-12 text-base px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none transition-all bg-[var(--input-background)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Confirm Password Input */}
          {mode === 'register' && (
            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[var(--foreground)] block">
                Confirmar Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                autoComplete="new-password"
                className="h-12 text-base px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none transition-all bg-[var(--input-background)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4 shadow-lg shadow-[var(--primary)]/25"
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Auth Mode Switch */}
        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--foreground-secondary)] mb-4 font-medium">
            {mode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          </p>
          <button
            type="button"
            onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
            className="text-base font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline transition-colors"
          >
            {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión aquí'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
