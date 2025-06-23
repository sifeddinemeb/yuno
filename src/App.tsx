import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ErrorBoundary } from 'react-error-boundary';
import { useCallback, useTransition } from 'react';
import NetworkErrorHandler from './components/ui/NetworkErrorHandler/NetworkErrorHandler';
import FeedbackForm from './components/ui/FeedbackForm/FeedbackForm';
import ThemeProvider from './components/layout/ThemeProvider/ThemeProvider';
import Navigation from './components/layout/Navigation/Navigation';
import Vision from './pages/Vision/Vision';
import Impact from './pages/Impact/Impact';
import Demo from './pages/Demo/Demo';
import Login from './pages/auth/Login/Login';
import SignUp from './pages/auth/SignUp/SignUp';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import Analytics from './pages/admin/Analytics/Analytics';
import Challenges from './pages/admin/Challenges/Challenges';
import ApiKeys from './pages/admin/ApiKeys/ApiKeys';
import Settings from './pages/admin/Settings/Settings';

function App() {
  const { adminUser, loading } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Wrap navigation updates in startTransition to avoid throttling warnings
  const transitionNavigation = useCallback((callback: () => void) => {
    startTransition(() => {
      callback();
    });
  }, [startTransition]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-dark-100">
          <div className="flex flex-col items-center space-y-4 max-w-md">
            <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg text-white">Loading Yuno...</span>
            <span className="text-sm text-gray-400">Initializing authentication</span>
            
            {/* Debug info in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-dark-200 rounded-lg text-xs text-gray-400 text-center">
                <div>Check browser console for debug info</div>
                <div className="mt-2">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-neon-blue hover:text-neon-purple transition-colors"
                  >
                    Force Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <NetworkErrorHandler retryFn={() => Promise.resolve()}>
          <Router future={{ v7_startTransition: true }}>
            <div className="min-h-screen transition-colors duration-300">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <ErrorBoundary>
                    <Vision />
                  </ErrorBoundary>
                } />
                <Route path="/impact" element={
                  <ErrorBoundary>
                    <Impact />
                  </ErrorBoundary>
                } />
                <Route path="/demo" element={
                  <ErrorBoundary>
                    <Demo />
                  </ErrorBoundary>
                } />
                
                {/* Auth Routes */}
                <Route 
                  path="/auth/login" 
                  element={adminUser ? <Navigate to="/admin" replace /> : (
                    <ErrorBoundary>
                      <Login />
                    </ErrorBoundary>
                  )} 
                />
                <Route 
                  path="/auth/signup" 
                  element={adminUser ? <Navigate to="/admin" replace /> : (
                    <ErrorBoundary>
                      <SignUp />
                    </ErrorBoundary>
                  )} 
                />
                
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  adminUser ? (
                    <div className="flex">
                      <Navigation />
                      <div className="flex-1 ml-0 md:ml-64">
                        <div className="p-8">
                          <ErrorBoundary>
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="/analytics" element={<Analytics />} />
                              <Route path="/challenges" element={<Challenges />} />
                              <Route path="/api-keys" element={<ApiKeys />} />
                              <Route path="/settings" element={<Settings />} />
                            </Routes>
                          </ErrorBoundary>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Navigate to="/auth/login" replace />
                  )
                } />
                
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              {/* Global Feedback Form (only on authenticated routes) */}
              {adminUser && (
                <FeedbackForm
                  variant="floating"
                  position="bottom-right"
                  onSubmit={(data) => {
                    console.log('Feedback submitted:', data);
                    // In production, this would send to backend
                    return Promise.resolve();
                  }}
                />
              )}
            </div>
          </Router>
        </NetworkErrorHandler>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;