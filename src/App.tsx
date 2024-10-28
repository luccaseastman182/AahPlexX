import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Providers } from './components/Providers';
import { ErrorBoundary } from './components/ErrorBoundary';

const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Courses = React.lazy(() => import('./pages/Courses'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner className="w-8 h-8" />
  </div>
);

export function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <Home />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="about"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <About />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="courses"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <Courses />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <Dashboard />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="sign-in"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <SignIn />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="sign-up"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <SignUp />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="forgot-password"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <ForgotPassword />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
              <Route
                path="reset-password"
                element={
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <ResetPassword />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Route>
          </Routes>
        </Router>
      </Providers>
    </ErrorBoundary>
  );
}

export default App;