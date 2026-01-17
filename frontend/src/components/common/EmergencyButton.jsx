import React, { useState } from 'react';
import useAccessibility from '../../hooks/useAccessibility';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';

/**
 * Emergency Help Button Component
 * Provides quick access to emergency medical services
 * Uses tel: protocol for direct phone dialing on mobile devices
 */
const EmergencyButton = ({ 
  helplineNumber = '+1-911',
  displayNumber = '911',
  position = 'fixed',
  showLabel = true,
  customStyle = {}
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { speak } = useAccessibility();
  const { fontSizeMultiplier, highContrast } = useAccessibilitySettings();

  // Extract only digits and + from phone number for tel: link
  const cleanPhoneNumber = helplineNumber.replace(/[^\d+]/g, '');

  const handleEmergencyClick = () => {
    // Announce to screen readers
    speak(`Initiating emergency call to ${displayNumber}. Confirm to proceed.`);
    setShowConfirmation(true);
  };

  const handleConfirmCall = () => {
    // Log for analytics/auditing
    console.log(`[EMERGENCY CALL] User initiated emergency call at ${new Date().toISOString()}`);
    
    // Announce action
    speak(`Calling emergency helpline ${displayNumber}`);
    
    // Use tel: protocol for native phone dialer
    // This works on mobile and desktop with phone integration
    window.location.href = `tel:${cleanPhoneNumber}`;
    
    // Reset confirmation after a delay
    setTimeout(() => {
      setShowConfirmation(false);
    }, 1000);
  };

  const handleCancelCall = () => {
    speak('Emergency call cancelled');
    setShowConfirmation(false);
  };

  const buttonStyle = {
    position,
    bottom: position === 'fixed' ? '30px' : 'auto',
    right: position === 'fixed' ? '30px' : 'auto',
    zIndex: position === 'fixed' ? 999 : 'auto',
    backgroundColor: highContrast ? '#dc2626' : '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '14px 28px',
    fontSize: `${fontSizeMultiplier * 18}px`,
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: position === 'fixed' 
      ? '0 8px 24px rgba(239, 68, 68, 0.4), 0 0 0 4px rgba(239, 68, 68, 0.2)'
      : '0 4px 12px rgba(239, 68, 68, 0.3)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
    ...customStyle
  };

  const hoverStyle = {
    backgroundColor: highContrast ? '#b91c1c' : '#dc2626',
    boxShadow: position === 'fixed'
      ? '0 12px 32px rgba(239, 68, 68, 0.5), 0 0 0 6px rgba(239, 68, 68, 0.25)'
      : '0 6px 16px rgba(239, 68, 68, 0.4)',
    transform: 'scale(1.05)'
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Emergency Button */}
      <button
        onClick={handleEmergencyClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={isHovered ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
        aria-label={`Emergency call button. Press to call ${displayNumber}`}
        title={`Click to call emergency helpline: ${displayNumber}`}
        className="emergency-button"
        disabled={showConfirmation}
      >
        {/* Warning Icon */}
        <svg
          width={`${fontSizeMultiplier * 20}px`}
          height={`${fontSizeMultiplier * 20}px`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>

        {/* Button Text */}
        {showLabel && <span>🚑 EMERGENCY</span>}
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-confirm-title"
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.3)',
              border: highContrast ? '4px solid #000000' : 'none',
              textAlign: 'center'
            }}
          >
            {/* Warning Icon in Modal */}
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
                animation: 'pulse 1s infinite'
              }}
            >
              🚨
            </div>

            {/* Title */}
            <h2
              id="emergency-confirm-title"
              style={{
                fontSize: `${fontSizeMultiplier * 28}px`,
                fontWeight: 'bold',
                color: highContrast ? '#000000' : '#dc2626',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}
            >
              Call Emergency Helpline?
            </h2>

            {/* Message */}
            <p
              style={{
                fontSize: `${fontSizeMultiplier * 20}px`,
                color: highContrast ? '#000000' : '#374151',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}
            >
              You are about to call <strong>{displayNumber}</strong> for emergency medical assistance.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              {/* Cancel Button */}
              <button
                onClick={handleCancelCall}
                style={{
                  padding: '12px 28px',
                  fontSize: `${fontSizeMultiplier * 18}px`,
                  fontWeight: 'bold',
                  backgroundColor: highContrast ? '#ffffff' : '#e5e7eb',
                  color: highContrast ? '#000000' : '#374151',
                  border: highContrast ? '2px solid #000000' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = highContrast ? '#f3f4f6' : '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = highContrast ? '#ffffff' : '#e5e7eb';
                }}
                aria-label="Cancel emergency call"
              >
                Cancel
              </button>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmCall}
                style={{
                  padding: '12px 28px',
                  fontSize: `${fontSizeMultiplier * 18}px`,
                  fontWeight: 'bold',
                  backgroundColor: highContrast ? '#dc2626' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = highContrast ? '#b91c1c' : '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = highContrast ? '#dc2626' : '#ef4444';
                }}
                aria-label={`Confirm call to ${displayNumber}`}
              >
                📞 CALL NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pulse Animation for Fixed Position */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .emergency-button:focus {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
        }

        .emergency-button:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .emergency-button {
            bottom: 20px !important;
            right: 20px !important;
            padding: 12px 24px !important;
            font-size: ${fontSizeMultiplier * 16}px !important;
          }
        }
      `}</style>
    </>
  );
};

export default EmergencyButton;
