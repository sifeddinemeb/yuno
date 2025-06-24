import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Settings, Key, Puzzle as PuzzlePiece, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../ui/Button/Button';
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut, adminUser } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Challenges', href: '/admin/challenges', icon: PuzzlePiece },
    { name: 'API Keys', href: '/admin/api-keys', icon: Key },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
    // Navigation will be handled by the auth state change
  };

  return (
    <>
      {/* Mobile menu button */}
      <div 
        className="md:hidden fixed top-4 left-4 z-50"
        aria-label="Mobile menu toggle"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 glass-dark p-6 z-40 transition-transform duration-300 overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
        id="mobile-menu"
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Logo */}
        <div className="mb-8" aria-label="Yuno logo">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <PuzzlePiece className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Yuno
            </span>
          </Link>
        </div>

        {/* User Info */}
        {adminUser && (
          <div className="mb-6 p-3 glass-light rounded-lg" aria-label="User information">
            <div className="text-sm font-medium text-primary">{adminUser.name}</div>
            <div className="text-xs text-muted">{adminUser.email}</div>
            <div className="text-xs text-neon-blue capitalize">{adminUser.role}</div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1" aria-label="Main navigation links">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`} 
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle and Logout */}
        <div className="space-y-4 mt-auto">
          <div className="flex items-center justify-between px-4" aria-label="Theme settings">
            <span className="text-sm text-muted">Theme</span>
            <ThemeToggle size="sm" />
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-secondary hover:text-primary"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navigation;