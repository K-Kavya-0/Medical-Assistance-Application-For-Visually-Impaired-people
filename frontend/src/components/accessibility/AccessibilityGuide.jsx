import React, { useState } from 'react';

const AccessibilityGuide = () => {
  const [activeTab, setActiveTab] = useState('screen-readers');

  const tabStyle = {
    padding: '12px 24px',
    backgroundColor: activeTab.includes('screen-readers') ? '#4f46e5' : '#e5e7eb',
    color: activeTab.includes('screen-readers') ? 'white' : '#1f2937',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: activeTab.includes('screen-readers') ? '4px 0 0 0' : '0',
    marginRight: '4px'
  };

  return (
    <div role="region" aria-label="Accessibility Guide">
      <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Accessibility Guide</h1>

      {/* Tabs */}
      <div role="tablist" style={{ display: 'flex', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' }}>
        <button
          role="tab"
          aria-selected={activeTab === 'screen-readers'}
          aria-controls="screen-readers-panel"
          onClick={() => setActiveTab('screen-readers')}
          style={tabStyle}
        >
          👁️ Screen Readers
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'keyboard'}
          aria-controls="keyboard-panel"
          onClick={() => setActiveTab('keyboard')}
          style={{
            ...tabStyle,
            backgroundColor: activeTab === 'keyboard' ? '#4f46e5' : '#e5e7eb',
            color: activeTab === 'keyboard' ? 'white' : '#1f2937',
            borderRadius: activeTab === 'keyboard' ? '4px 0 0 0' : '0',
          }}
        >
          ⌨️ Keyboard Navigation
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'voice'}
          aria-controls="voice-panel"
          onClick={() => setActiveTab('voice')}
          style={{
            ...tabStyle,
            backgroundColor: activeTab === 'voice' ? '#4f46e5' : '#e5e7eb',
            color: activeTab === 'voice' ? 'white' : '#1f2937',
            borderRadius: activeTab === 'voice' ? '4px 0 0 0' : '0',
          }}
        >
          🎙️ Voice Features
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'visual'}
          aria-controls="visual-panel"
          onClick={() => setActiveTab('visual')}
          style={{
            ...tabStyle,
            backgroundColor: activeTab === 'visual' ? '#4f46e5' : '#e5e7eb',
            color: activeTab === 'visual' ? 'white' : '#1f2937',
            borderRadius: activeTab === 'visual' ? '4px 0 0 0' : '0',
          }}
        >
          👁️ Visual Settings
        </button>
      </div>

      {/* Screen Readers Panel */}
      {activeTab === 'screen-readers' && (
        <div role="tabpanel" id="screen-readers-panel" style={{
          padding: '24px',
          backgroundColor: '#f9fafb',
          borderRadius: '4px'
        }}>
          <h2 style={{ marginTop: 0 }}>Using with Screen Readers</h2>
          <p>This application is fully compatible with popular screen readers including:</p>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li><strong>NVDA</strong> (Windows) - Free, open-source screen reader</li>
            <li><strong>JAWS</strong> (Windows) - Professional screen reader</li>
            <li><strong>VoiceOver</strong> (macOS, iOS) - Built-in Apple screen reader</li>
            <li><strong>TalkBack</strong> (Android) - Built-in Google screen reader</li>
          </ul>

          <h3>Getting Started with Screen Readers</h3>
          <ol style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li>Install your preferred screen reader from the links above</li>
            <li>Start the screen reader and launch this application</li>
            <li>The screen reader will announce: "MediAssist - Accessible Medical Assistant"</li>
            <li>Press the Tab key to navigate through interactive elements</li>
            <li>The screen reader will announce each button, link, and form field</li>
            <li>Press Enter to activate buttons or follow links</li>
          </ol>

          <h3>Tips for Best Experience</h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li>Enable "Screen Reader Optimized" in Accessibility Settings</li>
            <li>The app uses ARIA live regions to announce updates in real-time</li>
            <li>All images have descriptive alt text</li>
            <li>Headings are properly marked for navigation</li>
            <li>Form labels are associated with their input fields</li>
          </ul>

          <h3>Resources</h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li><a href="https://www.nvaccess.org/" target="_blank" rel="noopener noreferrer">NVDA - NV Access</a></li>
            <li><a href="https://www.freedomscientific.com/products/software/jaws/" target="_blank" rel="noopener noreferrer">JAWS - Freedom Scientific</a></li>
            <li><a href="https://www.apple.com/accessibility/voiceover/" target="_blank" rel="noopener noreferrer">VoiceOver - Apple</a></li>
          </ul>
        </div>
      )}

      {/* Keyboard Navigation Panel */}
      {activeTab === 'keyboard' && (
        <div role="tabpanel" id="keyboard-panel" style={{
          padding: '24px',
          backgroundColor: '#f9fafb',
          borderRadius: '4px'
        }}>
          <h2 style={{ marginTop: 0 }}>Keyboard Navigation</h2>
          <p>Navigate the entire application using only your keyboard.</p>

          <h3>Essential Keyboard Shortcuts</h3>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '16px',
            marginBottom: '24px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#e5e7eb' }}>
                <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left' }}>Key Combination</th>
                <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}<strong>Tab</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Move to next interactive element</td>
              </tr>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Shift + Tab</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Move to previous interactive element</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Enter</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Activate buttons and links</td>
              </tr>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Space</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Toggle checkboxes, activate buttons</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Arrow Keys</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Navigate within menus and lists</td>
              </tr>
            </tbody>
          </table>

          <h3>Navigation Shortcuts (Alt + Key)</h3>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '16px',
            marginBottom: '24px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#e5e7eb' }}>
                <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left' }}>Key Combination</th>
                <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left' }}>Destination</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Alt + H</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Home page</td>
              </tr>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Alt + S</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Scan Medicine</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Alt + M</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>My Medicines</td>
              </tr>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Alt + R</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Medication Reminders</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Alt + G</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Games</td>
              </tr>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Alt + P</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Profile</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>Alt + E</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Settings</td>
              </tr>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}><strong>?</strong></td>
                <td style={{ border: '1px solid #d1d5db', padding: '12px' }}>Show this help menu</td>
              </tr>
            </tbody>
          </table>

          <h3>Pro Tips</h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li>Press and hold the Alt key, then press the letter for quick navigation</li>
            <li>A visible focus indicator (blue box) shows which element is currently selected</li>
            <li>Skip the logo and navigation - use Alt shortcuts instead!</li>
            <li>Forms auto-focus the first input field when you enter them</li>
          </ul>
        </div>
      )}

      {/* Voice Features Panel */}
      {activeTab === 'voice' && (
        <div role="tabpanel" id="voice-panel" style={{
          padding: '24px',
          backgroundColor: '#f9fafb',
          borderRadius: '4px'
        }}>
          <h2 style={{ marginTop: 0 }}>Voice Features</h2>
          <p>The application includes built-in voice feedback to help you navigate and understand what's happening.</p>

          <h3>Voice Feedback Features</h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li><strong>Automatic Page Announcements</strong> - Hears page title and main content when loading</li>
            <li><strong>Button & Link Descriptions</strong> - Get descriptions when hovering over or focusing elements</li>
            <li><strong>Form Feedback</strong> - Hear what was submitted and any errors that occur</li>
            <li><strong>Navigation Shortcuts</strong> - Voice confirms when you use Alt+key navigation</li>
            <li><strong>Interactive Guidance</strong> - Contextual tips as you explore features</li>
          </ul>

          <h3>Controlling Voice</h3>
          <p>Visit Accessibility Settings to adjust:</p>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li><strong>Enable/Disable Voice</strong> - Toggle voice feedback on or off</li>
            <li><strong>Volume</strong> - Adjust from 0% (silent) to 100% (maximum)</li>
            <li><strong>Speed</strong> - From 0.5x (slower) to 2x (faster)</li>
          </ul>

          <h3>Voice Navigation Mode</h3>
          <p>Enable "Voice Guided Navigation" for automatic spoken instructions about available features every 30 seconds.</p>
        </div>
      )}

      {/* Visual Settings Panel */}
      {activeTab === 'visual' && (
        <div role="tabpanel" id="visual-panel" style={{
          padding: '24px',
          backgroundColor: '#f9fafb',
          borderRadius: '4px'
        }}>
          <h2 style={{ marginTop: 0 }}>Visual Accessibility Settings</h2>
          <p>Customize the visual appearance to meet your needs.</p>

          <h3>High Contrast Mode</h3>
          <p>Increases the contrast between text and background colors for better readability. Useful for:</p>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li>Low vision users</li>
            <li>Bright sunlight environments</li>
            <li>Monitor glare issues</li>
          </ul>

          <h3>Font Size Options</h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li><strong>Small</strong> - 14px (default for some users)</li>
            <li><strong>Medium</strong> - 16px (standard)</li>
            <li><strong>Large</strong> - 18px (easier to read)</li>
            <li><strong>Extra Large</strong> - 20px (maximum readability)</li>
          </ul>

          <h3>Focus Indicator Size</h3>
          <p>The focus indicator is the outline that shows which button or link is selected. Choose your preferred thickness:</p>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li><strong>Thin</strong> - 2px outline (subtle)</li>
            <li><strong>Normal</strong> - 3px outline (default)</li>
            <li><strong>Thick</strong> - 4px outline (very visible)</li>
          </ul>

          <h3>Color Blindness Support</h3>
          <p>Select your color vision type for optimized color schemes:</p>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            <li><strong>None</strong> - Standard colors</li>
            <li><strong>Deuteranopia</strong> - Red-green color blindness (green-blind)</li>
            <li><strong>Protanopia</strong> - Red-green color blindness (red-blind)</li>
            <li><strong>Tritanopia</strong> - Blue-yellow color blindness</li>
          </ul>

          <h3>Large Buttons</h3>
          <p>Increases button size for easier clicking and tapping, especially helpful with tremors or motor control issues.</p>

          <h3>Reduce Motion</h3>
          <p>Disables animations and transitions, helpful for users sensitive to motion or experiencing motion sickness.</p>
        </div>
      )}

      {/* Quick Start */}
      <div style={{
        marginTop: '40px',
        padding: '24px',
        backgroundColor: '#dbeafe',
        border: '2px solid #3b82f6',
        borderRadius: '8px'
      }}>
        <h2 style={{ marginTop: 0, color: '#1e40af' }}>🚀 Quick Start Recommendations</h2>
        <h3 style={{ color: '#1e40af' }}>For Blind Users</h3>
        <ol style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <li>Install NVDA (free) or JAWS (professional)</li>
          <li>Go to Accessibility Settings and select "Blind-Friendly" preset</li>
          <li>Enable Voice Feedback for additional guidance</li>
          <li>Learn Alt+Key shortcuts for fast navigation</li>
        </ol>

        <h3 style={{ color: '#1e40af' }}>For Low Vision Users</h3>
        <ol style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <li>Go to Accessibility Settings</li>
          <li>Select "Low Vision" preset</li>
          <li>Adjust font size to "Large" or "Extra Large"</li>
          <li>Enable "High Contrast Mode" for better visibility</li>
        </ol>

        <h3 style={{ color: '#1e40af' }}>For Keyboard-Only Users</h3>
        <ol style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <li>Learn the Tab key navigation (move forward) and Shift+Tab (move backward)</li>
          <li>Use Alt+Key combinations to jump to main sections</li>
          <li>Press ? to see the full keyboard shortcut guide</li>
          <li>Press Enter to activate buttons and links</li>
        </ol>
      </div>
    </div>
  );
};

export default AccessibilityGuide;
