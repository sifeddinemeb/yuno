import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  Brain
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import Card from '../../../components/ui/Card/Card';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import { useStore } from '../../../store/useStore';

interface ProfileForm {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings = () => {
  const { user, isDarkMode } = useStore();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notifications, setNotifications] = useState({
    newIntegration: true,
    highBotActivity: true,
    systemHealth: false,
    weeklyReport: true,
    securityAlerts: true
  });
  const [widgetTheme, setWidgetTheme] = useState('auto');
  const [betaFeatures, setBetaFeatures] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    autoApprove: false,
    qualityThreshold: 85,
    maxGenerationCount: 5,
    safetyLevel: 'medium'
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || 'Admin User',
      email: user?.email || 'admin@example.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    
    // Mock save operation
    setTimeout(() => {
      console.log('Settings saved:', { ...data, notifications, widgetTheme, betaFeatures });
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset password fields
      reset({
        name: data.name,
        email: data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
            <p className="text-muted">Manage your account preferences and platform configuration</p>
          </div>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center text-neon-green"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Settings saved successfully
            </motion.div>
          )}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary">Profile Settings</h2>
                <p className="text-muted">Update your personal information</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
              />

              <Input
                label="Email Address"
                type="email"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
          </Card>
        </motion.div>

        {/* Password Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-red to-red-600 rounded-xl flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary">Change Password</h2>
                <p className="text-muted">Update your account password</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPasswords.current ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  error={errors.currentPassword?.message}
                  {...register('currentPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-muted hover:text-primary transition-colors"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Enter new password"
                    error={errors.newPassword?.message}
                    {...register('newPassword', {
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain uppercase, lowercase, and number'
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-muted hover:text-primary transition-colors"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', {
                      validate: (value) => value === newPassword || 'Passwords do not match'
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-muted hover:text-primary transition-colors"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary">Notification Preferences</h2>
                <p className="text-muted">Choose what notifications you'd like to receive</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries({
                newIntegration: 'New Integration Alerts',
                highBotActivity: 'High Bot Activity Detected',
                systemHealth: 'System Health Issues',
                weeklyReport: 'Weekly Performance Reports',
                securityAlerts: 'Security Alerts'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-4 glass-light rounded-lg">
                  <div>
                    <div className="font-medium text-primary">{label}</div>
                    <div className="text-sm text-muted">
                      {key === 'newIntegration' && 'Get notified when new clients integrate Yuno'}
                      {key === 'highBotActivity' && 'Alerts when bot detection rates spike'}
                      {key === 'systemHealth' && 'Notifications about system downtime or issues'}
                      {key === 'weeklyReport' && 'Weekly summary of platform performance'}
                      {key === 'securityAlerts' && 'Critical security notifications'}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) => handleNotificationChange(key, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-blue/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Application Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card variant="glass">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-violet-600 rounded-xl flex items-center justify-center mr-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary">Application Settings</h2>
                <p className="text-muted">Configure platform behavior and appearance</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Default Widget Theme
                </label>
                <select
                  value={widgetTheme}
                  onChange={(e) => setWidgetTheme(e.target.value)}
                  className="input-field"
                >
                  <option value="auto">Auto (Follow System)</option>
                  <option value="dark">Always Dark</option>
                  <option value="light">Always Light</option>
                </select>
                <p className="text-sm text-muted mt-1">
                  This affects how the Yuno widget appears on client websites by default
                </p>
              </div>

              <div className="flex items-center justify-between p-4 glass-light rounded-lg">
                <div>
                  <div className="font-medium text-primary">Enable Beta Features</div>
                  <div className="text-sm text-muted">
                    Get early access to experimental features and improvements
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={betaFeatures}
                    onChange={(e) => setBetaFeatures(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-blue/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
                </label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Content Generation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card variant="glass">
            <div className="flex items-center space-x-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-primary">AI Content Settings</h2>
                <p className="text-muted">Configure AI-powered content generation</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-violet-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass-light rounded-lg">
                <div>
                  <div className="font-medium text-primary">Auto-Approve High Quality Content</div>
                  <div className="text-sm text-muted">
                    Automatically approve AI-generated content above quality threshold
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={aiSettings.autoApprove}
                    onChange={(e) => setAiSettings({...aiSettings, autoApprove: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-blue/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Quality Threshold for Auto-Approval (%)
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="95"
                    step="5"
                    value={aiSettings.qualityThreshold}
                    onChange={(e) => setAiSettings({...aiSettings, qualityThreshold: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-sm text-muted mt-1">{aiSettings.qualityThreshold}%</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Maximum Generation Count
                  </label>
                  <select
                    value={aiSettings.maxGenerationCount}
                    onChange={(e) => setAiSettings({...aiSettings, maxGenerationCount: parseInt(e.target.value)})}
                    className="input-field"
                  >
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Content Safety Level
                </label>
                <select
                  value={aiSettings.safetyLevel}
                  onChange={(e) => setAiSettings({...aiSettings, safetyLevel: e.target.value})}
                  className="input-field"
                >
                  <option value="low">Low (More creative, less filtering)</option>
                  <option value="medium">Medium (Balanced approach)</option>
                  <option value="high">High (Maximum safety filters)</option>
                </select>
                <p className="text-sm text-muted mt-1">
                  Determines how strictly content is filtered for safety and appropriateness
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-end"
        >
          <Button
            type="submit"
            disabled={isSaving}
            className="px-8"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default Settings;