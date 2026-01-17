import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';
import useAccessibility from '../../hooks/useAccessibility';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';
import EmergencyButton from '../../components/common/EmergencyButton';

const HomePage = () => {
  const { state, actions } = useAppData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [announcedText, setAnnouncedText] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const { speak } = useAccessibility();
  const { fontSizeMultiplier, highContrast } = useAccessibilitySettings();
  const mainRef = useRef(null);
  const skipLinkRef = useRef(null);

  useEffect(() => {
    // Focus main content area for screen readers
    if (mainRef.current) {
      mainRef.current.focus();
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Refresh data periodically
    const refreshTimer = setInterval(() => {
      actions.refreshAll();
    }, 15000); // Refresh every 15 seconds
    
    // Initial refresh
    actions.refreshAll();
    
    // Announce welcome message
    const welcomeMessage = `Welcome to Medical Assistant. Today is ${currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}. You have ${state.stats.medicines} medicines, ${state.stats.activeReminders} active reminders, and ${state.stats.dosesToday} doses taken today.`;
    setAnnouncedText(welcomeMessage);
    speak(welcomeMessage);
    
    return () => {
      clearInterval(timer);
      clearInterval(refreshTimer);
    };
  }, [speak, currentTime, actions, state.stats]);

  // Function to announce text for screen readers
  const announce = (text) => {
    setAnnouncedText(text);
    speak(text);
  };

  // Function to handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Alt + O for overview section
    if (e.altKey && e.key === 'o') {
      setActiveSection('overview');
      const element = document.getElementById('overview-section');
      if (element) element.focus();
      announce('Navigated to overview section');
    }
    // Alt + Q for quick actions section
    if (e.altKey && e.key === 'q') {
      setActiveSection('quick-actions');
      const element = document.getElementById('quick-actions-section');
      if (element) element.focus();
      announce('Navigated to quick actions section');
    }
    // Alt + R for reminders section
    if (e.altKey && e.key === 'r') {
      setActiveSection('reminders');
      const element = document.getElementById('reminders-section');
      if (element) element.focus();
      announce('Navigated to reminders section');
    }
    // Alt + E for emergency section
    if (e.altKey && e.key === 'e') {
      setActiveSection('emergency');
      const element = document.getElementById('emergency-section');
      if (element) element.focus();
      announce('Navigated to emergency information section');
    }
  };

  // Skip to main content function
  const skipToMainContent = () => {
    if (skipLinkRef.current) {
      skipLinkRef.current.focus();
    }
  };

  // Quick action cards data
  const quickActions = [
    {
      id: 1,
      title: "Scan Medicine",
      description: "Use camera to scan medicine packages",
      icon: "📷",
      link: "/scan",
      color: "#3b82f6",
      bgColor: "#dbeafe",
      shortcut: "Alt+S"
    },
    {
      id: 2,
      title: "My Medicines",
      description: "View and manage your medicines",
      icon: "💊",
      link: "/medicines",
      color: "#10b981",
      bgColor: "#dcfce7",
      shortcut: "Alt+M"
    },
    {
      id: 3,
      title: "Medication Reminders",
      description: "Set and manage your medication schedule",
      icon: "⏰",
      link: "/reminders",
      color: "#8b5cf6",
      bgColor: "#ede9fe",
      shortcut: "Alt+R"
    },
    {
      id: 4,
      title: "Settings",
      description: "Customize accessibility preferences",
      icon: "⚙️",
      link: "/settings",
      color: "#f59e0b",
      bgColor: "#fef3c7",
      shortcut: "Alt+E"
    },
    {
      id: 5,
      title: "Profile",
      description: "Manage your personal information",
      icon: "👤",
      link: "/profile",
      color: "#ef4444",
      bgColor: "#fee2e2",
      shortcut: "Alt+P"
    }
  ];

  // Stats cards data
  const statsCards = [
    {
      id: 1,
      title: "Medicines",
      value: state.stats.medicines,
      color: "#1e40af",
      bgColor: "#dbeafe",
      description: "Total medicines in your collection"
    },
    {
      id: 2,
      title: "Active Reminders",
      value: state.stats.activeReminders,
      color: "#16a34a",
      bgColor: "#dcfce7",
      description: "Currently active medication reminders"
    },
    {
      id: 3,
      title: "Today's Doses",
      value: state.stats.dosesToday,
      color: "#ea580c",
      bgColor: "#fed7aa",
      description: "Scheduled doses for today"
    }
  ];

  // Get upcoming reminders from state
  const upcomingReminders = state.reminders.filter(reminder => 
    reminder.isActive && 
    new Date(reminder.nextDue) > new Date()
  );

  return (
    <div 
      style={{ 
        backgroundColor: highContrast ? '#ffffff' : '#f0f9ff', 
        minHeight: '100vh', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        fontSize: `${fontSizeMultiplier * 16}px`,
        lineHeight: '1.6',
        margin: '0 auto',
        maxWidth: '1200px'
      }}
      onKeyDown={handleKeyDown}
      tabIndex="-1"
      ref={mainRef}
    >
      {/* Skip link for screen readers */}
      <a 
        href="#main-content" 
        onClick={skipToMainContent}
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
          e.target.style.backgroundColor = highContrast ? '#000000' : '#3b82f6';
          e.target.style.color = highContrast ? '#ffffff' : 'white';
          e.target.style.padding = '10px';
          e.target.style.borderRadius = '4px';
          e.target.style.zIndex = 1000;
          e.target.style.border = highContrast ? '2px solid #ffffff' : 'none';
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

      {/* Screen reader announcement area */}
      <div 
        aria-live="assertive" 
        aria-atomic="true" 
        style={{ 
          position: 'absolute', 
          left: '-10000px', 
          width: '1px', 
          height: '1px', 
          overflow: 'hidden' 
        }}
      >
        {announcedText}
      </div>

      <div 
        id="main-content"
        style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          border: highContrast ? '4px solid #000000' : '4px solid #3b82f6'
        }}
        ref={skipLinkRef}
        tabIndex="-1"
      >
        {/* Header Section */}
        <header style={{ textAlign: 'center', marginBottom: '40px', padding: '20px' }}>
          <h1 
            style={{ 
              fontSize: `${fontSizeMultiplier * 44}px`, 
              fontWeight: '800', 
              color: highContrast ? '#000000' : '#1e40af',
              marginBottom: '15px',
              borderBottom: highContrast ? '6px solid #000000' : '6px solid #3b82f6',
              paddingBottom: '15px',
              paddingTop: '10px',
              textShadow: highContrast ? 'none' : '1px 1px 2px rgba(0,0,0,0.1)'
            }}
            tabIndex="0"
            aria-label="Medical Assistant Dashboard"
          >
            🏥 Medical Assistant
          </h1>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            <p 
              style={{ 
                fontSize: `${fontSizeMultiplier * 26}px`, 
                color: highContrast ? '#000000' : '#4b5563',
                marginBottom: '0',
                fontWeight: '600'
              }}
              tabIndex="0"
              aria-label={`Today is ${currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}`}
            >
              📅 {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p 
              style={{ 
                fontSize: `${fontSizeMultiplier * 22}px`, 
                color: highContrast ? '#000000' : '#6b7280',
                marginBottom: '0',
                fontWeight: '500'
              }}
              tabIndex="0"
              aria-label={`Current time is ${currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}`}
            >
              🕐 {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </header>

        {/* Quick Actions Grid */}
        <section 
          id="quick-actions-section"
          style={{ marginBottom: '40px' }}
          aria-labelledby="quick-actions-heading"
          tabIndex="-1"
        >
          <h2 
            id="quick-actions-heading"
            style={{ 
              fontSize: `${fontSizeMultiplier * 30}px`, 
              fontWeight: '700', 
              color: highContrast ? '#000000' : '#1f2937',
              marginBottom: '25px',
              borderBottom: highContrast ? '4px solid #000000' : '4px solid #60a5fa',
              paddingBottom: '10px',
              display: 'flex',
              alignItems: 'center'
            }}
            tabIndex="0"
          >
            <span style={{ fontSize: `${fontSizeMultiplier * 36}px`, marginRight: '15px' }}>⚡</span>
            Quick Actions
            <button
              onClick={() => {
                setActiveSection('quick-actions');
                announce('Quick actions section activated');
              }}
              style={{
                marginLeft: 'auto',
                padding: '10px 20px',
                backgroundColor: highContrast ? '#000000' : '#60a5fa',
                color: highContrast ? '#ffffff' : 'white',
                border: highContrast ? '2px solid #ffffff' : 'none',
                borderRadius: '8px',
                fontSize: `${fontSizeMultiplier * 16}px`,
                cursor: 'pointer',
                fontWeight: '600'
              }}
              tabIndex="0"
              aria-label="Jump to quick actions section"
            >
              Jump
            </button>
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '25px',
            marginTop: '20px'
          }}>
            {quickActions.map(action => (
              <Link 
                key={action.id}
                to={action.link}
                onClick={() => {
                  announce(`Navigate to ${action.title} page. ${action.description}`);
                }}
                style={{
                  display: 'block',
                  padding: '30px',
                  backgroundColor: highContrast ? '#f3f4f6' : action.bgColor,
                  border: highContrast ? '4px solid #000000' : `4px solid ${action.color}`,
                  borderRadius: '16px',
                  textDecoration: 'none',
                  color: highContrast ? '#000000' : action.color,
                  fontWeight: '700',
                  fontSize: `${fontSizeMultiplier * 22}px`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                tabIndex="0"
                role="button"
                aria-label={`${action.title}. ${action.description}. Press enter to navigate.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    announce(`Navigate to ${action.title} page. ${action.description}`);
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={{ 
                  fontSize: `${fontSizeMultiplier * 50}px`, 
                  marginBottom: '20px',
                  filter: highContrast ? 'grayscale(100%)' : 'none'
                }}>
                  {action.icon}
                </div>
                <div style={{ 
                  marginBottom: '15px',
                  fontSize: `${fontSizeMultiplier * 24}px`
                }}>
                  {action.title}
                </div>
                <div style={{ 
                  fontSize: `${fontSizeMultiplier * 18}px`, 
                  fontWeight: 'normal', 
                  marginTop: '10px',
                  opacity: '0.9'
                }}>
                  {action.description}
                </div>
                <div style={{ 
                  position: 'absolute', 
                  top: '15px', 
                  right: '15px', 
                  backgroundColor: highContrast ? '#000000' : action.color, 
                  color: 'white', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  fontSize: `${fontSizeMultiplier * 14}px`,
                  fontWeight: 'bold'
                }}>
                  {action.shortcut}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Overview */}
        <section 
          id="overview-section"
          style={{ marginBottom: '40px' }}
          aria-labelledby="overview-heading"
          tabIndex="-1"
        >
          <h2 
            id="overview-heading"
            style={{ 
              fontSize: `${fontSizeMultiplier * 30}px`, 
              fontWeight: '700', 
              color: highContrast ? '#000000' : '#1f2937',
              marginBottom: '25px',
              borderBottom: highContrast ? '4px solid #000000' : '4px solid #60a5fa',
              paddingBottom: '10px',
              display: 'flex',
              alignItems: 'center'
            }}
            tabIndex="0"
          >
            <span style={{ fontSize: `${fontSizeMultiplier * 36}px`, marginRight: '15px' }}>📊</span>
            Today's Overview
            <button
              onClick={() => {
                setActiveSection('overview');
                announce('Overview section activated');
              }}
              style={{
                marginLeft: 'auto',
                padding: '10px 20px',
                backgroundColor: highContrast ? '#000000' : '#60a5fa',
                color: highContrast ? '#ffffff' : 'white',
                border: highContrast ? '2px solid #ffffff' : 'none',
                borderRadius: '8px',
                fontSize: `${fontSizeMultiplier * 16}px`,
                cursor: 'pointer',
                fontWeight: '600'
              }}
              tabIndex="0"
              aria-label="Jump to overview section"
            >
              Jump
            </button>
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '25px' 
          }}>
            {statsCards.map((stat) => (
              <div 
                key={stat.id}
                role="region"
                aria-labelledby={`stat-title-${stat.id}`}
                style={{
                  padding: '30px',
                  backgroundColor: highContrast ? '#f3f4f6' : stat.bgColor,
                  border: highContrast ? '4px solid #000000' : `4px solid ${stat.color}`,
                  borderRadius: '16px',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div 
                  id={`stat-title-${stat.id}`}
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 40}px`, 
                    fontWeight: '800', 
                    color: highContrast ? '#000000' : stat.color, 
                    marginBottom: '15px'
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ 
                  color: highContrast ? '#000000' : stat.color, 
                  fontWeight: '700', 
                  fontSize: `${fontSizeMultiplier * 22}px`, 
                  marginBottom: '10px'
                }}>
                  {stat.title}
                </div>
                <div style={{ 
                  color: highContrast ? '#000000' : stat.color, 
                  fontSize: `${fontSizeMultiplier * 16}px`,
                  opacity: '0.9'
                }}>
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Reminders */}
        <section 
          id="reminders-section"
          style={{ marginBottom: '40px' }}
          aria-labelledby="reminders-heading"
          tabIndex="-1"
        >
          <h2 
            id="reminders-heading"
            style={{ 
              fontSize: `${fontSizeMultiplier * 30}px`, 
              fontWeight: '700', 
              color: highContrast ? '#000000' : '#1f2937',
              marginBottom: '25px',
              borderBottom: highContrast ? '4px solid #000000' : '4px solid #60a5fa',
              paddingBottom: '10px',
              display: 'flex',
              alignItems: 'center'
            }}
            tabIndex="0"
          >
            <span style={{ fontSize: `${fontSizeMultiplier * 36}px`, marginRight: '15px' }}>🔔</span>
            Upcoming Reminders
            <button
              onClick={() => {
                setActiveSection('reminders');
                announce('Reminders section activated');
              }}
              style={{
                marginLeft: 'auto',
                padding: '10px 20px',
                backgroundColor: highContrast ? '#000000' : '#60a5fa',
                color: highContrast ? '#ffffff' : 'white',
                border: highContrast ? '2px solid #ffffff' : 'none',
                borderRadius: '8px',
                fontSize: `${fontSizeMultiplier * 16}px`,
                cursor: 'pointer',
                fontWeight: '600'
              }}
              tabIndex="0"
              aria-label="Jump to reminders section"
            >
              Jump
            </button>
          </h2>
          
          {upcomingReminders.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr', 
              gap: '25px' 
            }}>
              {upcomingReminders.map(reminder => (
                <div 
                  key={reminder.id}
                  role="article"
                  aria-labelledby={`reminder-title-${reminder.id}`}
                  style={{
                    padding: '30px',
                    backgroundColor: highContrast ? '#f3f4f6' : '#e0f2fe',
                    border: highContrast ? '4px solid #000000' : '4px solid #0ea5e9',
                    borderRadius: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div id={`reminder-title-${reminder.id}`}>
                    <h3 style={{ 
                      fontSize: `${fontSizeMultiplier * 26}px`, 
                      fontWeight: '700', 
                      color: highContrast ? '#000000' : '#0284c7',
                      marginBottom: '12px'
                    }}>
                      {reminder.medicineName}
                    </h3>
                    <p style={{ 
                      color: highContrast ? '#000000' : '#0284c7', 
                      fontSize: `${fontSizeMultiplier * 20}px`, 
                      marginBottom: '12px'
                    }}>
                      <strong>Dosage:</strong> {reminder.dosage}
                    </p>
                    <p style={{ 
                      color: highContrast ? '#000000' : '#0284c7', 
                      fontWeight: '700', 
                      fontSize: `${fontSizeMultiplier * 22}px`
                    }}>
                      <strong>Due Time:</strong> {new Date(reminder.nextDue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button
                      onClick={() => announce(`Reminder for ${reminder.medicineName} at ${new Date(reminder.nextDue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}. ${reminder.dosage}`)}
                      style={{
                        backgroundColor: highContrast ? '#000000' : '#0ea5e9',
                        color: 'white',
                        border: highContrast ? '3px solid #ffffff' : '3px solid #0284c7',
                        borderRadius: '12px',
                        width: '70px',
                        height: '70px',
                        cursor: 'pointer',
                        fontSize: `${fontSizeMultiplier * 28}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                      tabIndex="0"
                      aria-label={`Read reminder details for ${reminder.medicineName}`}
                    >
                      🔊
                    </button>
                    <Link
                      to="/reminders"
                      style={{
                        backgroundColor: highContrast ? '#000000' : '#3b82f6',
                        color: 'white',
                        border: highContrast ? '3px solid #ffffff' : '3px solid #2563eb',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        fontSize: `${fontSizeMultiplier * 18}px`,
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontWeight: '700',
                        minWidth: '120px'
                      }}
                      tabIndex="0"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: highContrast ? '#f3f4f6' : '#f9fafb',
              border: highContrast ? '4px dashed #000000' : '4px dashed #d1d5db',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{ 
                fontSize: `${fontSizeMultiplier * 28}px`, 
                color: highContrast ? '#000000' : '#6b7280',
                marginBottom: '15px'
              }}>
                🎉 No upcoming reminders
              </div>
              <p style={{ 
                color: highContrast ? '#000000' : '#6b7280', 
                marginTop: '15px',
                fontSize: `${fontSizeMultiplier * 20}px`
              }}>
                Great job! You're all caught up with your medication schedule
              </p>
              <Link
                to="/reminders"
                style={{
                  display: 'inline-block',
                  marginTop: '25px',
                  padding: '15px 30px',
                  backgroundColor: highContrast ? '#000000' : '#3b82f6',
                  color: 'white',
                  border: highContrast ? '3px solid #ffffff' : '3px solid #2563eb',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: `${fontSizeMultiplier * 20}px`
                }}
                tabIndex="0"
              >
                Set Reminders
              </Link>
            </div>
          )}
        </section>

        {/* Accessibility Features */}
        <section style={{ 
          backgroundColor: highContrast ? '#f3f4f6' : '#e0f2fe', 
          border: highContrast ? '4px solid #000000' : '4px solid #0ea5e9',
          borderRadius: '16px', 
          padding: '35px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <h2 
            style={{ 
              fontSize: `${fontSizeMultiplier * 28}px`, 
              fontWeight: '700', 
              color: highContrast ? '#000000' : '#0284c7',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center'
            }}
            tabIndex="0"
          >
            <span style={{ fontSize: `${fontSizeMultiplier * 36}px`, marginRight: '15px' }}>♿</span>
            Accessibility Features
          </h2>
          <ul style={{ 
            color: highContrast ? '#000000' : '#0284c7',
            paddingLeft: '35px',
            fontSize: `${fontSizeMultiplier * 20}px`,
            lineHeight: '2.0'
          }}>
            <li style={{ marginBottom: '20px' }} tabIndex="0">
              <strong>⌨️ Keyboard Navigation:</strong> Press Tab to move between interactive elements, Enter/Space to activate
            </li>
            <li style={{ marginBottom: '20px' }} tabIndex="0">
              <strong>🔊 Screen Reader:</strong> All elements properly labeled with ARIA attributes for optimal screen reader experience
            </li>
            <li style={{ marginBottom: '20px' }} tabIndex="0">
              <strong>🎨 High Contrast:</strong> High contrast color scheme with clear visual separation between elements
            </li>
            <li style={{ marginBottom: '20px' }} tabIndex="0">
              <strong>🔤 Large Text:</strong> Sufficiently large fonts (minimum 20px) with appropriate spacing for easy reading
            </li>
            <li style={{ marginBottom: '20px' }} tabIndex="0">
              <strong>🎯 Focus Indicators:</strong> Clear, visible focus indicators (6px borders) for all interactive elements
            </li>
            <li style={{ marginBottom: '20px' }} tabIndex="0">
              <strong>📢 Audio Feedback:</strong> Audio descriptions available for all important information
            </li>
            <li style={{ marginBottom: '20px' }} tabIndex="0">
              <strong>⌨️ Keyboard Shortcuts:</strong> Alt+O (Overview), Alt+Q (Quick Actions), Alt+R (Reminders), Alt+E (Emergency)
            </li>
            <li tabIndex="0">
              <strong>⏩ Skip Links:</strong> Use skip links to navigate directly to main content sections
            </li>
          </ul>
        </section>

        {/* Emergency Information */}
        <section 
          id="emergency-section"
          style={{ 
            padding: '35px', 
            backgroundColor: highContrast ? '#f3f4f6' : '#fef2f2', 
            border: highContrast ? '4px solid #000000' : '4px solid #fecaca',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
          tabIndex="-1"
        >
          <h2 
            style={{ 
              fontSize: `${fontSizeMultiplier * 28}px`, 
              fontWeight: '700', 
              color: highContrast ? '#000000' : '#b91c1c',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center'
            }}
            tabIndex="0"
          >
            <span style={{ fontSize: `${fontSizeMultiplier * 36}px`, marginRight: '15px' }}>🚨</span>
            Emergency Information
          </h2>
          <ul style={{ 
            color: highContrast ? '#000000' : '#b91c1c',
            paddingLeft: '35px',
            fontSize: `${fontSizeMultiplier * 20}px`,
            lineHeight: '2.0'
          }}>
            <li style={{ marginBottom: '15px' }} tabIndex="0">
              <strong>📞 Emergency Number:</strong> Call 911 or your local emergency number immediately
            </li>
            <li style={{ marginBottom: '15px' }} tabIndex="0">
              <strong>📋 Medication List:</strong> Keep an updated list of all medications for emergency responders
            </li>
            <li style={{ marginBottom: '15px' }} tabIndex="0">
              <strong>🏪 Pharmacy Contact:</strong> Have your pharmacy's phone number readily available
            </li>
            <li style={{ marginBottom: '15px' }} tabIndex="0">
              <strong>👨‍⚕️ Doctor's Number:</strong> Contact your healthcare provider for non-emergency concerns
            </li>
            <li tabIndex="0">
              <strong>⚠️ Allergy Information:</strong> Inform emergency responders of any known allergies
            </li>
          </ul>
        </section>

        {/* Emergency Call Button */}
        <EmergencyButton 
          helplineNumber="+1-911"
          displayNumber="911"
        />
      </div>
    </div>
  );
};

export default HomePage;