import { Moon, Sun } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import Button from '../Button/Button';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  label?: string;
}

const ThemeToggle = ({ className = '', size = 'md', label = 'Toggle dark mode' }: ThemeToggleProps) => {
  const { isDarkMode, toggleDarkMode } = useStore();

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleDarkMode}
      className={`relative overflow-hidden hover:bg-glass-light rounded-lg ${className}`}
      aria-label={label}
      aria-pressed={isDarkMode}
      aria-pressed={isDarkMode}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
          aria-hidden="true" 
          aria-hidden="true"
        />
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
          aria-hidden="true" 
          aria-hidden="true"
        />
      </div>
    </Button>
  );
};

export default ThemeToggle;