import { Moon, Sun } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import Button from '../Button/Button';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const ThemeToggle = ({ className = '', size = 'md', label = 'Toggle dark mode' }: ThemeToggleProps) => {
  const { isDarkMode, toggleDarkMode } = useStore();

  const handleClick = () => {
    toggleDarkMode();
    
    // Add visual transition to the entire page when toggling
    const body = document.body;
    body.style.transition = 'background-color 0.5s ease';
    setTimeout(() => {
      body.style.transition = '';
    }, 500);
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      className={`relative overflow-hidden hover:bg-glass-light rounded-lg ${className}`}
      role="switch"
      aria-label={label}
      aria-checked={isDarkMode}
    >
      <div className="relative w-5 h-5">
        <motion.div 
          initial={false}
          animate={{
            rotate: isDarkMode ? 90 : 0,
            scale: isDarkMode ? 0 : 1,
            opacity: isDarkMode ? 0 : 1
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute inset-0 w-5 h-5 text-yellow-400"
          aria-hidden="true"
        >
          <Sun />
        </motion.div>
        <motion.div 
          initial={false}
          animate={{
            rotate: isDarkMode ? 0 : -90,
            scale: isDarkMode ? 1 : 0,
            opacity: isDarkMode ? 1 : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute inset-0 w-5 h-5 text-neon-blue"
          aria-hidden="true"
        >
          <Moon />
        </motion.div>
      </div>
    </Button>
  );
};

export default ThemeToggle;