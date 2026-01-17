import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilitySettingsContext = createContext();

export const useAccessibilitySettings = () => {
  const context = useContext(AccessibilitySettingsContext);
  if (!context) {
    throw new Error('useAccessibilitySettings must be used within an AccessibilitySettingsProvider');
  }
  return context;
};

export const AccessibilitySettingsProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-fontSize') || 'medium';
    const savedHighContrast = localStorage.getItem('accessibility-highContrast') === 'true';
    const savedScreenReader = localStorage.getItem('accessibility-screenReader') !== 'false';
    const savedAudioFeedback = localStorage.getItem('accessibility-audioFeedback') !== 'false';
    const savedReduceMotion = localStorage.getItem('accessibility-reduceMotion') === 'true';

    setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);
    setScreenReaderEnabled(savedScreenReader);
    setAudioFeedback(savedAudioFeedback);
    setReduceMotion(savedReduceMotion);
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem('accessibility-fontSize', fontSize);
    localStorage.setItem('accessibility-highContrast', highContrast.toString());
    localStorage.setItem('accessibility-screenReader', screenReaderEnabled.toString());
    localStorage.setItem('accessibility-audioFeedback', audioFeedback.toString());
    localStorage.setItem('accessibility-reduceMotion', reduceMotion.toString());
  }, [fontSize, highContrast, screenReaderEnabled, audioFeedback, reduceMotion]);

  const increaseFontSize = () => {
    if (fontSize === 'small') setFontSize('medium');
    else if (fontSize === 'medium') setFontSize('large');
  };

  const decreaseFontSize = () => {
    if (fontSize === 'large') setFontSize('medium');
    else if (fontSize === 'medium') setFontSize('small');
  };

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const toggleScreenReader = () => setScreenReaderEnabled(!screenReaderEnabled);
  const toggleAudioFeedback = () => setAudioFeedback(!audioFeedback);
  const toggleReduceMotion = () => setReduceMotion(!reduceMotion);

  const value = {
    fontSize,
    highContrast,
    screenReaderEnabled,
    audioFeedback,
    reduceMotion,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleScreenReader,
    toggleAudioFeedback,
    toggleReduceMotion,
    // Font size multipliers
    fontSizeMultiplier: fontSize === 'small' ? 0.875 : fontSize === 'large' ? 1.125 : 1
  };

  return (
    <AccessibilitySettingsContext.Provider value={value}>
      {children}
    </AccessibilitySettingsContext.Provider>
  );
};