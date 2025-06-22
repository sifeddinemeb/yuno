import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import Card from '../../../components/ui/Card/Card';
import ThemeToggle from '../../../components/ui/ThemeToggle/ThemeToggle';
import { useAuth } from '../../../hooks/useAuth';
import { useStore } from '../../../store/useStore';

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, loading } = useAuth();
  const { isAuthenticated } = useStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    
    const result = await signIn(data.email, data.password);
    
    if (!result.success) {
      setError(result.error);
    }
    // If successful, the useAuth hook will handle the redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your Yuno dashboard</p>
        </div>

        <Card variant="glass">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-neon-red/20 border border-neon-red/30 rounded-lg"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 text-neon-red" />
                <span className="text-neon-red text-sm">{error}</span>
              </motion.div>
            )}

            <Input
              id="login-email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <div className="relative">
              <Input
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-current transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-neon-blue bg-transparent border border-gray-400 rounded focus:ring-neon-blue focus:ring-2"
                  aria-label="Remember me"
                />
                <span className="ml-2 text-sm text-gray-400">
                  <label htmlFor="remember-me">Remember me</label>
                </span>
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-neon-blue hover:text-neon-purple transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/auth/signup"
                className="text-neon-blue hover:text-neon-purple transition-colors font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Development Note */}
          <div className="mt-6 p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
            <p className="text-xs text-neon-blue text-center">
              <strong>Note:</strong> You need to create an admin account first. 
              Use the Sign Up page to create your admin account.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;