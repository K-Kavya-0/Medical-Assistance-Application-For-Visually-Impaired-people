import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilitySettingsProvider } from './contexts/AccessibilitySettingsContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './pages/dashboard/HomePage';
import MedicineListPage from './pages/medicine/MedicineListPage';
import MedicineDetailPage from './pages/medicine/MedicineDetailPage';
import RemindersPage from './pages/reminders/RemindersPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import ScanPage from './pages/scan/ScanPage';
import MyMedicinePage from './pages/medicine/MyMedicinePage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <ErrorBoundary>
      <AccessibilitySettingsProvider>
        <div 
          className="min-h-screen bg-blue-50"
          style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            lineHeight: '1.6'
          }}
        >
          <a 
            href="#main-content" 
            className="sr-only focus-not-sr-only"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
              zIndex: 1000
            }}
            onFocus={(e) => {
              e.target.style.position = 'fixed';
              e.target.style.top = '10px';
              e.target.style.left = '10px';
              e.target.style.width = 'auto';
              e.target.style.height = 'auto';
              e.target.style.overflow = 'visible';
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.color = 'white';
              e.target.style.padding = '10px';
              e.target.style.borderRadius = '4px';
              e.target.style.zIndex = 1000;
            }}
            onBlur={(e) => {
              e.target.style.position = 'absolute';
              e.target.style.left = '-10000px';
              e.target.style.width = '1px';
              e.target.style.height = '1px';
              e.target.style.overflow = 'hidden';
            }}
          >
            Skip to main content
          </a>
          
          <main id="main-content" tabIndex="-1">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/medicines" element={<MedicineListPage />} />
              <Route path="/medicines/:id" element={<MedicineDetailPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/my-medicine" element={<MyMedicinePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </AccessibilitySettingsProvider>
    </ErrorBoundary>
  );
};

export default App;