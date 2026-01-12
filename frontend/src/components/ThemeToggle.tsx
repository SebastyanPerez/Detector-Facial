import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-[var(--secondary)] hover:bg-[var(--muted)] transition-all flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)] transition-colors" />
      ) : (
        <Sun size={18} className="text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)] transition-colors" />
      )}
    </button>
  );
}
