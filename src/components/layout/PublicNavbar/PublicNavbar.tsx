import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Puzzle as PuzzlePiece } from 'lucide-react';
import clsx from 'clsx';
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle';
import Button from '../../ui/Button/Button';

const navItems = [
  { label: 'Vision', path: '/' },
  { label: 'Impact', path: '/impact' },
  { label: 'Demo', path: '/demo' },
];

const PublicNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMobile = () => setIsOpen((prev) => !prev);

  const closeMobile = () => setIsOpen(false);

  const linkClasses = (isActive: boolean) =>
    clsx(
      'text-sm font-medium transition-colors',
      isActive ? 'text-neon-blue' : 'text-secondary hover:text-primary'
    );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/40 border-b border-white/10 dark:border-white/5 light:bg-white/90 light:border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobile}>
            <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <PuzzlePiece className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Yuno
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => linkClasses(isActive)}
              >
                {label}
              </NavLink>
            ))}

            <Link to="/auth/login" onClick={closeMobile}>
              <Button size="sm">Get Started</Button>
            </Link>
            <ThemeToggle size="sm" />
          </div>

          {/* Mobile toggle */}
          <button
            onClick={toggleMobile}
            className="md:hidden p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none light:hover:bg-gray-200"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" aria-modal="true" role="dialog">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm light:bg-black/30"
            onClick={closeMobile}
          />
          <div className="absolute top-16 left-0 w-full bg-dark-900 glass-dark p-6 space-y-6 border-t border-white/10 dark:border-white/5 light:border-gray-300">
            {navItems.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => linkClasses(isActive)}
                onClick={closeMobile}
              >
                {label}
              </NavLink>
            ))}

            <Link to="/auth/login" onClick={closeMobile}>
              <Button size="md" className="w-full">Get Started</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
};

export default PublicNavbar;