import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import authService from './features/auth/authService';
import AuthModal from './features/auth/AuthModal';
import AppLayout from './components/AppLayout';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import RecommendationsPage from './pages/RecommendationsPage';

import DashboardOverview from './pages/DashboardOverview';
import FocusAreasPage from './pages/FocusAreasPage';
import ActivitiesPage from './pages/ActivitiesPage';
import HabitsPage from './pages/HabitsPage';
import GoalsPage from './pages/GoalsPage';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('token');
      const refreshParam = urlParams.get('refreshToken');

      if (tokenParam && refreshParam) {
        localStorage.setItem('token', tokenParam);
        localStorage.setItem('refreshToken', refreshParam);
        window.history.replaceState({}, document.title, window.location.pathname);
        setIsLoggedIn(true);
        navigate('/dashboard');
        return;
      }

      setIsLoggedIn(authService.isAuthenticated());
    } catch (e) {
      console.error('Auth verification error:', e);
    }
  }, [navigate]);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="app">
        <AuthModal
          isOpen={authOpen}
          initialMode={authMode}
          onClose={() => setAuthOpen(false)}
          onAuthSuccess={() => {
            setIsLoggedIn(true);
            navigate('/dashboard');
          }}
        />

        <header className="navbar">
          <div className="page-container flex-row-between navbar-inner">
            <div className="brand">Habitude</div>
            <div className="flex-row nav-actions">
              <button className="btn btn-outline" onClick={() => openAuth('login')}>
                Sign In
              </button>
              <button className="btn btn-primary" onClick={() => openAuth('register')}>
                Get Started
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="hero">
            <div className="hero-glow" />
            <div className="page-container hero-content">
              <span className="badge hero-badge">AI-Powered Habit & Focus Tracking</span>
              <h1>
                Master your time, habits,
                <br />
                <span className="hero-highlight">and focus.</span>
              </h1>
              <p className="hero-description">
                Organize priorities, record effort against custom focus areas, build routines, and track measurable milestones.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary hero-button" onClick={() => openAuth('register')}>
                  Create Free Account
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout onLogout={handleLogout} />}>
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/focus" element={<FocusAreasPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}