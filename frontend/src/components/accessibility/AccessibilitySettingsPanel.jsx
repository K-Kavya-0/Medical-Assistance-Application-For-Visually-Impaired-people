import React, { useState } from 'react';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';
import { announceSuccess } from '../../utils/screenReaderAnnouncements';

const AccessibilitySettingsPanel = () => {
  const { settings, updateSetting, updateMultipleSettings } = useAccessibilitySettings();
  const [lastAnnounce, setLastAnnounce] = useState('');

  const handleSettingChange = (key, value, label) => {
    updateSetting(key, value);
    const message = `${label} changed to ${value === true ? 'enabled' : value === false ? 'disabled' : value}`;
    announceSuccess(message);
    setLastAnnounce(message);
  };

  const handleMultipleChanges = (changes, label) => {
    updateMultipleSettings(changes);
    announceSuccess(`${label} applied`);
  };

  return (
    <div role="region" aria-label="Accessibility Settings" style={{
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Accessibility Settings</h1>
      
      {lastAnnounce && (
        <div 
          role="status" 
          aria-live="polite"
          style={{
            backgroundColor: '#d4edda',
            border: '2px solid #28a745',
            color: '#155724',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}
        >
          {lastAnnounce}
        </div>
      )}

      {/* High Contrast Mode */}
      <fieldset style={{
        border: '2px solid #cccccc',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <legend style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
          Visual Settings
        </legend>

        {/* High Contrast Toggle */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '16px' }}>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => handleSettingChange('highContrast', e.target.checked, 'High contrast mode')}
              aria-label="Enable high contrast mode for better visibility"
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                cursor: 'pointer'
              }}
            />
            <span>High Contrast Mode</span>
          </label>
          <p style={{ marginLeft: '32px', color: '#666666', marginTop: '4px' }}>
            Use pure black and white colors for maximum contrast
          </p>
        </div>

        {/* Font Size */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="fontSize" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>
            Font Size:
          </label>
          <select
            id="fontSize"
            value={settings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', e.target.value, 'Font size')}
            aria-label="Choose font size: small, medium, large, or extra large"
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '2px solid #cccccc',
              minWidth: '200px'
            }}
          >
            <option value="small">Small (14px)</option>
            <option value="medium">Medium (16px)</option>
            <option value="large">Large (18px)</option>
            <option value="extraLarge">Extra Large (20px)</option>
          </select>
        </div>

        {/* Focus Indicator Size */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="focusIndicator" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>
            Focus Indicator Size:
          </label>
          <select
            id="focusIndicator"
            value={settings.focusIndicatorSize}
            onChange={(e) => handleSettingChange('focusIndicatorSize', e.target.value, 'Focus indicator size')}
            aria-label="Choose focus indicator size for better keyboard navigation visibility"
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '2px solid #cccccc',
              minWidth: '200px'
            }}
          >
            <option value="thin">Thin (2px)</option>
            <option value="normal">Normal (3px)</option>
            <option value="thick">Thick (4px)</option>
          </select>
        </div>

        {/* Color Blind Mode */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="colorBlindMode" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>
            Color Blindness Mode:
          </label>
          <select
            id="colorBlindMode"
            value={settings.colorBlindMode}
            onChange={(e) => handleSettingChange('colorBlindMode', e.target.value, 'Color blindness mode')}
            aria-label="Select your color vision type to adjust colors accordingly"
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '2px solid #cccccc',
              minWidth: '200px'
            }}
          >
            <option value="none">None (Normal)</option>
            <option value="deuteranopia">Deuteranopia (Red-Green)</option>
            <option value="protanopia">Protanopia (Red-Green)</option>
            <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
          </select>
        </div>

        {/* Large Buttons */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '16px' }}>
            <input
              type="checkbox"
              checked={settings.largeButtons}
              onChange={(e) => handleSettingChange('largeButtons', e.target.checked, 'Large buttons')}
              aria-label="Make all buttons larger for easier clicking"
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                cursor: 'pointer'
              }}
            />
            <span>Large Buttons</span>
          </label>
          <p style={{ marginLeft: '32px', color: '#666666', marginTop: '4px' }}>
            Increase button size for easier interaction
          </p>
        </div>

        {/* Reduced Motion */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '16px' }}>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => handleSettingChange('reducedMotion', e.target.checked, 'Reduced motion')}
              aria-label="Reduce animations and transitions to prevent motion sensitivity issues"
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                cursor: 'pointer'
              }}
            />
            <span>Reduce Motion</span>
          </label>
          <p style={{ marginLeft: '32px', color: '#666666', marginTop: '4px' }}>
            Minimize animations and transitions
          </p>
        </div>
      </fieldset>

      {/* Voice Settings */}
      <fieldset style={{
        border: '2px solid #cccccc',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <legend style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
          Voice & Audio Settings
        </legend>

        {/* Voice Enabled */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '16px' }}>
            <input
              type="checkbox"
              checked={settings.voiceEnabled}
              onChange={(e) => handleSettingChange('voiceEnabled', e.target.checked, 'Voice feedback')}
              aria-label="Enable voice feedback to hear descriptions of actions"
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                cursor: 'pointer'
              }}
            />
            <span>Enable Voice Feedback</span>
          </label>
          <p style={{ marginLeft: '32px', color: '#666666', marginTop: '4px' }}>
            Hear descriptions and confirmations of actions
          </p>
        </div>

        {/* Voice Volume */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="voiceVolume" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>
            Voice Volume: {Math.round(settings.voiceVolume * 100)}%
          </label>
          <input
            id="voiceVolume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.voiceVolume}
            onChange={(e) => handleSettingChange('voiceVolume', parseFloat(e.target.value), `Voice volume set to ${Math.round(parseFloat(e.target.value) * 100)}%`)}
            aria-label="Adjust voice volume"
            style={{
              width: '100%',
              maxWidth: '300px',
              height: '8px',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Voice Speed */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="voiceSpeed" style={{ display: 'block', marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>
            Voice Speed: {(settings.voiceSpeed * 100).toFixed(0)}%
          </label>
          <input
            id="voiceSpeed"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.voiceSpeed}
            onChange={(e) => handleSettingChange('voiceSpeed', parseFloat(e.target.value), `Voice speed set to ${(parseFloat(e.target.value) * 100).toFixed(0)}%`)}
            aria-label="Adjust voice speed"
            style={{
              width: '100%',
              maxWidth: '300px',
              height: '8px',
              cursor: 'pointer'
            }}
          />
          <small style={{ display: 'block', marginTop: '4px', color: '#666666' }}>
            0.5x slower - 1x normal - 2x faster
          </small>
        </div>
      </fieldset>

      {/* Keyboard Settings */}
      <fieldset style={{
        border: '2px solid #cccccc',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <legend style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
          Navigation Settings
        </legend>

        {/* Keyboard Navigation */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '16px' }}>
            <input
              type="checkbox"
              checked={settings.keyboardNavigationEnabled}
              onChange={(e) => handleSettingChange('keyboardNavigationEnabled', e.target.checked, 'Keyboard navigation')}
              aria-label="Enable full keyboard navigation without mouse"
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                cursor: 'pointer'
              }}
            />
            <span>Enable Keyboard Navigation</span>
          </label>
          <p style={{ marginLeft: '32px', color: '#666666', marginTop: '4px' }}>
            Navigate the entire app using only your keyboard
          </p>
        </div>

        {/* Screen Reader Optimized */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '16px' }}>
            <input
              type="checkbox"
              checked={settings.screenReaderOptimized}
              onChange={(e) => handleSettingChange('screenReaderOptimized', e.target.checked, 'Screen reader optimization')}
              aria-label="Optimize interface for screen reader users"
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                cursor: 'pointer'
              }}
            />
            <span>Screen Reader Optimized</span>
          </label>
          <p style={{ marginLeft: '32px', color: '#666666', marginTop: '4px' }}>
            Optimizes the interface for use with screen readers like NVDA or JAWS
          </p>
        </div>
      </fieldset>

      {/* Preset Combinations */}
      <fieldset style={{
        border: '2px solid #cccccc',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <legend style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
          Quick Presets
        </legend>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <button
            onClick={() => handleMultipleChanges({
              highContrast: true,
              fontSize: 'large',
              focusIndicatorSize: 'thick',
              voiceEnabled: true,
              largeButtons: true
            }, 'Blind-friendly preset')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            aria-label="Apply blind-friendly preset with high contrast, large text, and voice feedback"
          >
            👨‍🦯 Blind-Friendly
          </button>

          <button
            onClick={() => handleMultipleChanges({
              highContrast: true,
              fontSize: 'large',
              focusIndicatorSize: 'thick',
              largeButtons: true,
              reducedMotion: true
            }, 'Low vision preset')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            aria-label="Apply low vision preset with maximum contrast and size"
          >
            👁️ Low Vision
          </button>

          <button
            onClick={() => handleMultipleChanges({
              highContrast: false,
              fontSize: 'medium',
              focusIndicatorSize: 'normal',
              voiceEnabled: false,
              largeButtons: false,
              reducedMotion: false,
              keyboardNavigationEnabled: true
            }, 'Keyboard-only preset')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            aria-label="Apply keyboard-only navigation preset"
          >
            ⌨️ Keyboard Only
          </button>

          <button
            onClick={() => handleMultipleChanges({
              highContrast: false,
              fontSize: 'medium',
              focusIndicatorSize: 'normal',
              voiceEnabled: false,
              largeButtons: false,
              reducedMotion: false,
              colorBlindMode: 'none'
            }, 'Default preset')}
            style={{
              padding: '12px 16px',
              fontSize: '16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            aria-label="Reset to default settings"
          >
            🔄 Reset to Default
          </button>
        </div>
      </fieldset>

      {/* Information Section */}
      <section 
        role="region" 
        aria-label="Accessibility information and tips"
        style={{
          backgroundColor: '#e3f2fd',
          border: '2px solid #2196f3',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}
      >
        <h2 style={{ marginTop: 0, color: '#1976d2' }}>💡 Tips for Best Experience</h2>
        <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
          <li>Enable voice feedback to hear descriptions as you navigate</li>
          <li>Use keyboard shortcuts (press ? for a full list) to navigate faster</li>
          <li>Try the preset combinations to find the best settings for you</li>
          <li>Use a screen reader like NVDA, JAWS, or VoiceOver for the best blind-friendly experience</li>
          <li>Press Tab to move forward and Shift+Tab to move backward through interactive elements</li>
          <li>Use Alt+Letter combinations for quick navigation to main sections</li>
        </ul>
      </section>
    </div>
  );
};

export default AccessibilitySettingsPanel;
