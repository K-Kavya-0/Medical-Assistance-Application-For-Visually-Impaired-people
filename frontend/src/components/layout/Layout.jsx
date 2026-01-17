import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SkipNavigation from '../common/SkipNavigation';
import VoiceFeedbackToggle from '../accessibility/VoiceFeedbackToggle';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';
import { announceNavigation } from '../../utils/screenReaderAnnouncements';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [keyboardHintShown, setKeyboardHintShown] = useState(false);
  const location = useLocation();
  const { settings } = useAccessibilitySettings();

  // Simplified navigation (includes main app sections for easy top-level access)
  const navigation = [
    { name: 'Home', href: '/', shortcut: 'Alt+H' },
    { name: 'Scan Medicine', href: '/scan', shortcut: 'Alt+S' },
    { name: 'My Medicines', href: '/medicines', shortcut: 'Alt+M' },
    { name: 'My Medicine History', href: '/my-medicine', shortcut: 'Alt+Y' },
    { name: 'Medication Reminders', href: '/reminders', shortcut: 'Alt+R' },
    { name: 'Games', href: '/games', shortcut: 'Alt+G' },
    { name: 'Profile', href: '/profile', shortcut: 'Alt+P' },
    { name: 'Settings', href: '/settings', shortcut: 'Alt+E' },
  ];

  const isActive = (path) => location.pathname === path;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?') {
        setKeyboardHintShown(!keyboardHintShown);
      }
      // Alt+H: Home
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        announceNavigation('Home');
      }
      // Alt+S: Scan
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        announceNavigation('Scan Medicine');
      }
      // Alt+M: Medicines
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        announceNavigation('My Medicines');
      }
      // Alt+R: Reminders
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        announceNavigation('Medication Reminders');
      }
      // Alt+G: Games
      if (e.altKey && e.key === 'g') {
        e.preventDefault();
        announceNavigation('Games');
      }
      // Alt+P: Profile
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        announceNavigation('Profile');
      }
      // Alt+E: Settings (Accessibility)
      if (e.altKey && e.key === 'y') {
        e.preventDefault();
        announceNavigation('My Medicine History');
      }
      if (e.altKey && e.key === 'e') {
        e.preventDefault();
        announceNavigation('Settings');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardHintShown]);

  const headerStyle = {
    backgroundColor: settings.highContrast ? '#000000' : '#0f172a',
    padding: '18px 12px',
    color: settings.highContrast ? '#ffffff' : 'white',
    borderBottom: settings.highContrast ? '3px solid #ffffff' : 'none'
  };

  const navLinkStyle = (isCurrentPage) => ({
    color: settings.highContrast ? '#000080' : 'white',
    backgroundColor: isCurrentPage ? (settings.highContrast ? '#ffff00' : 'rgba(99, 102, 241, 0.2)') : 'transparent',
    textDecoration: 'none',
    fontWeight: isCurrentPage ? '700' : '500',
    fontSize: settings.fontSize === 'large' ? '18px' : settings.fontSize === 'extraLarge' ? '20px' : '16px',
    padding: '8px 12px',
    borderRadius: '6px',
    outline: 'none',
    display: 'inline-block',
    border: isCurrentPage ? `${settings.focusIndicatorSize === 'thick' ? '3px' : '2px'} solid ${settings.highContrast ? '#ffffff' : '#4f46e5'}` : 'none'
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: settings.highContrast ? '#ffffff' : '#f9fafb',
      fontFamily: 'Arial, sans-serif',
      color: settings.highContrast ? '#000000' : '#1f2937',
      fontSize: settings.fontSize === 'large' ? '18px' : settings.fontSize === 'extraLarge' ? '20px' : '16px'
    }}>
      {/* Skip link for keyboard users */}
      <SkipNavigation />

      {/* Keyboard shortcut hint */}
      {keyboardHintShown && (
        <div 
          role="region" 
          aria-label="Keyboard shortcuts"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: settings.highContrast ? '#000000' : '#1f2937',
            color: settings.highContrast ? '#ffff00' : '#ffffff',
            padding: '20px',
            zIndex: 9999,
            maxHeight: '80vh',
            overflowY: 'auto',
            fontSize: settings.fontSize === 'large' ? '16px' : settings.fontSize === 'extraLarge' ? '18px' : '14px'
          }}
        >
          <button 
            onClick={() => setKeyboardHintShown(false)}
            aria-label="Close keyboard shortcuts"
            style={{
              float: 'right',
              background: settings.highContrast ? '#ffff00' : '#4f46e5',
              color: settings.highContrast ? '#000000' : '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: 'inherit'
            }}
          >
            Close (Escape)
          </button>
          <h2 style={{ marginTop: 0 }}>Keyboard Shortcuts</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {navigation.map((item) => (
              <li key={item.href} style={{ marginBottom: '8px' }}>
                <strong>{item.shortcut}</strong>: {item.name}
              </li>
            ))}
            <li style={{ marginBottom: '8px' }}>
              <strong>?</strong>: Show this help
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Tab</strong>: Navigate forward through links and buttons
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Shift+Tab</strong>: Navigate backward through links and buttons
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Enter</strong>: Activate buttons and links
            </li>
          </ul>
        </div>
      )}

      {/* Accessible header / banner */}
      <header role="banner" aria-label="Site header" style={headerStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: settings.fontSize === 'large' ? '26px' : settings.fontSize === 'extraLarge' ? '28px' : '24px',
              fontWeight: 700 
            }}>
              MediAssist
            </h1>
            <p style={{ 
              margin: 0, 
              color: settings.highContrast ? '#cccccc' : '#c7d2fe', 
              fontSize: settings.fontSize === 'large' ? '16px' : settings.fontSize === 'extraLarge' ? '18px' : '14px',
              fontStyle: 'italic'
            }} aria-hidden="true">
              — Accessible Medical Assistant
            </p>
          </div>

          <nav 
            aria-label="Main navigation" 
            role="navigation"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setKeyboardHintShown(false);
              }
            }}
          >
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {navigation.map((item) => (
                <li key={item.name} role="none">
                  <Link 
                    to={item.href} 
                    role="menuitem"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    aria-label={`${item.name}${isActive(item.href) ? ', current page' : ''} (${item.shortcut})`}
                    style={navLinkStyle(isActive(item.href))}
                    tabIndex={0}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 ${settings.focusIndicatorSize === 'thick' ? '4px' : '3px'} rgba(99,102,241,0.5)`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              <li role="none">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '8px' }}>
                  {/* Voice feedback toggle placed in header for quick access */}
                  <div aria-hidden={false}>
                    <VoiceFeedbackToggle />
                  </div>

                  {/* Quick link to accessibility settings */}
                  <Link 
                    to={'/settings'} 
                    aria-label="Accessibility settings. Open to customize font size, contrast, voice speed and more." 
                    style={{
                      color: settings.highContrast ? '#000000' : '#0f172a',
                      backgroundColor: settings.highContrast ? '#ffff00' : '#f8fafc',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: 'inherit',
                      fontWeight: 600,
                      border: settings.highContrast ? '2px solid #000000' : 'none'
                    }}
                  >
                    ⚙️ Accessibility
                  </Link>
                </div>
              </li>
            </ul>
          </nav>
        </div>
        {/* Keyboard help hint */}
        <div style={{
          textAlign: 'center',
          marginTop: '12px',
          fontSize: settings.fontSize === 'large' ? '14px' : settings.fontSize === 'extraLarge' ? '16px' : '12px',
          color: settings.highContrast ? '#ffff00' : '#c7d2fe'
        }}>
          Press <strong>?</strong> for keyboard shortcuts
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" role="main" tabIndex={-1} style={{ 
        padding: '28px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontSize: 'inherit'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;