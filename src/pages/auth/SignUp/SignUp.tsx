import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import Card from '../../../components/ui/Card/Card';
import ThemeToggle from '../../../components/ui/ThemeToggle/ThemeToggle';
import { useAuth } from '../../../hooks/useAuth';
import { useStore } from '../../../store/useStore';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signUp, loading } = useAuth();
  const { isAuthenticated } = useStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>();

  const password = watch('password');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: SignUpForm) => {
    setError(null);
    setSuccess(null);
    
    const result = await signUp(data.email, data.password, data.name);
    
    if (result.success) {
      setSuccess('Account created successfully! Please check your email to verify your account, then sign in.');
    } else {
      setError(result.error);
    }
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
          <h1 className="text-2xl font-bold mb-2">Create Admin Account</h1>
          <p className="text-gray-400">Set up your Yuno admin dashboard access</p>
        </div>

        <Card variant="glass">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-neon-red/20 border border-neon-red/30 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-neon-red" />
                <span className="text-neon-red text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-neon-green/20 border border-neon-green/30 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-neon-green" />
                <span className="text-neon-green text-sm">{success}</span>
              </motion.div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />

            <Input
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
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number',
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-current transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-current transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 text-neon-blue bg-transparent border border-gray-400 rounded focus:ring-neon-blue focus:ring-2 mt-1"
                required
              />
              <label className="ml-2 text-sm text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-neon-blue hover:text-neon-purple transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-neon-blue hover:text-neon-purple transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Admin Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-neon-blue hover:text-neon-purple transition-colors font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUp;