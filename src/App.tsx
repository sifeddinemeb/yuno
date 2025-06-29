import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MissingEnvScreen from './components/ui/MissingEnvScreen/MissingEnvScreen';
import { ErrorBoundary } from 'react-error-boundary';
import NetworkErrorHandler from './components/ui/NetworkErrorHandler/NetworkErrorHandler';
import FeedbackForm from './components/ui/FeedbackForm/FeedbackForm';
import ThemeProvider from './components/layout/ThemeProvider/ThemeProvider';
import BackgroundBlobs from './components/layout/BackgroundBlobs/BackgroundBlobs';
import ScrollToTop from './components/layout/ScrollToTop/ScrollToTop';
import { BoltNewBadge } from '@/components/ui/bolt-new-badge';
import { lazy, Suspense } from 'react';

// Lazy load pages for performance
const Vision = lazy(() => import('./pages/Vision/Vision'));
const Impact = lazy(() => import('./pages/Impact/Impact'));
const Demo = lazy(() => import('./pages/Demo/Demo'));
const Login = lazy(() => import('./pages/auth/Login/Login'));
const SignUp = lazy(() => import('./pages/auth/SignUp/SignUp'));

// Admin pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard/Dashboard'));
const Analytics = lazy(() => import('./pages/admin/Analytics/Analytics'));
const Challenges = lazy(() => import('./pages/admin/Challenges/Challenges'));
const ApiKeys = lazy(() => import('./pages/admin/ApiKeys/ApiKeys'));
const Settings = lazy(() => import('./pages/admin/Settings/Settings'));

// Navigation
const Navigation = lazy(() => import('./components/layout/Navigation/Navigation'));

// Generic error fallback for all boundaries
const errorFallback = ({ error }: { error: Error }) => (
  <div role="alert" className="p-4 text-red-500">
    Something went wrong: {error.message}
  </div>
);

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-100">
    <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { adminUser, envError, authReady } = useAuth() as any;

  if (envError) {
    return <MissingEnvScreen />;
  }

  // Show loading spinner while checking authentication with progressive status hints
  if (!authReady) {
    return (
      <ThemeProvider>
        <BackgroundBlobs />
        <div className="min-h-screen flex items-center justify-center bg-dark-100">
          <div className="flex flex-col items-center space-y-4 max-w-md">
            <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg text-white">Loading Yuno...</span>
            {/* progressive steps */}
            {(() => {
              const steps = [
                'Initializing app',
                'Connecting to Supabase',
                'Validating session',
                'Fetching admin data',
                'Preparing dashboard'
              ];
              const step = steps[Math.min(Math.floor(Date.now() / 1500) % steps.length, steps.length - 1)];
              return <span className="text-sm text-gray-400">{step}...</span>;
            })()}
            
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
      <BackgroundBlobs />
      <ErrorBoundary fallbackRender={errorFallback}>
        <NetworkErrorHandler retryFn={() => Promise.resolve()}>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen transition-colors duration-300">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <ErrorBoundary fallbackRender={errorFallback}>
                    <Suspense fallback={<PageLoader />}>
                      <Vision />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="/impact" element={
                  <ErrorBoundary fallbackRender={errorFallback}>
                    <Suspense fallback={<PageLoader />}>
                      <Impact />
                    </Suspense>
                  </ErrorBoundary>
                } />
                <Route path="/demo" element={
                  <ErrorBoundary fallbackRender={errorFallback}>
                    <Suspense fallback={<PageLoader />}>
                      <Demo />
                    </Suspense>
                  </ErrorBoundary>
                } />
                
                {/* Auth Routes */}
                <Route 
                  path="/auth/login" 
                  element={adminUser ? <Navigate to="/admin" replace /> : (
                    <ErrorBoundary fallbackRender={errorFallback}>
                      <Suspense fallback={<PageLoader />}>
                        <Login />
                      </Suspense>
                    </ErrorBoundary>
                  )} 
                />
                <Route 
                  path="/auth/signup" 
                  element={adminUser ? <Navigate to="/admin" replace /> : (
                    <ErrorBoundary fallbackRender={errorFallback}>
                      <Suspense fallback={<PageLoader />}>
                        <SignUp />
                      </Suspense>
                    </ErrorBoundary>
                  )} 
                />
                
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  adminUser ? (
                    <div className="flex h-screen overflow-hidden">
                      <Suspense fallback={<div className="w-64 bg-dark-200 animate-pulse"></div>}>
                        <Navigation />
                      </Suspense>
                      <div className="flex-1 ml-0 md:ml-64 min-w-0 flex flex-col">
                        <div className="p-8 overflow-y-auto flex-1">
                          <ErrorBoundary fallbackRender={errorFallback}>
                            <Routes>
                              <Route path="/" element={
                                <Suspense fallback={<PageLoader />}>
                                  <Dashboard />
                                </Suspense>
                              } />
                              <Route path="/analytics" element={
                                <Suspense fallback={<PageLoader />}>
                                  <Analytics />
                                </Suspense>
                              } />
                              <Route path="/challenges" element={
                                <Suspense fallback={<PageLoader />}>
                                  <Challenges />
                                </Suspense>
                              } />
                              <Route path="/api-keys" element={
                                <Suspense fallback={<PageLoader />}>
                                  <ApiKeys />
                                </Suspense>
                              } />
                              <Route path="/settings" element={
                                <Suspense fallback={<PageLoader />}>
                                  <Settings />
                                </Suspense>
                              } />
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
            <BoltNewBadge 
              position="bottom-left" 
              variant="auto" 
              size="medium"
            />
          </Router>
        </NetworkErrorHandler>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;