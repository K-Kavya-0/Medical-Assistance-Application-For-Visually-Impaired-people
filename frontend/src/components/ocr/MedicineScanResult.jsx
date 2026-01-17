import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import Alert from '../common/Alert';
import useAccessibility from '../../hooks/useAccessibility';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';

const MedicineScanResult = ({ 
  ocrResult, 
  error, 
  onSetReminder, 
  onScanAgain,
  onListen,
  isLoading
}) => {
  const { speak } = useAccessibility();
  const { fontSizeMultiplier, highContrast } = useAccessibilitySettings();
  const [showReminderConfirmation, setShowReminderConfirmation] = useState(false);
  const [medicineName, setMedicineName] = useState('');

  // Log errors for debugging
  useEffect(() => {
    if (error) {
      console.error('[MedicineScanResult] OCR Error:', error);
    }
  }, [error]);

  // Validate ocrResult data
  const validateOcrResult = (data) => {
    if (!data) return null;
    
    // Ensure required fields exist
    if (typeof data.confidence !== 'number') {
      console.warn('[MedicineScanResult] Invalid confidence value:', data.confidence);
      data.confidence = 0;
    }
    
    // Ensure medicines array exists
    if (!Array.isArray(data.medicines)) {
      console.warn('[MedicineScanResult] Medicines not an array, setting to empty');
      data.medicines = [];
    }
    
    // Ensure rawText exists
    if (!data.rawText || typeof data.rawText !== 'string') {
      console.warn('[MedicineScanResult] Invalid rawText');
      data.rawText = 'No text extracted';
    }
    
    return data;
  };

  // Validate and sanitize ocrResult
  const validatedResult = validateOcrResult(ocrResult);

  // Determine current state
  const hasData = validatedResult !== null;
  const hasDetectedMedicine = hasData && validatedResult.medicines && validatedResult.medicines.length > 0;
  const detectedMedicine = hasDetectedMedicine ? validatedResult.medicines[0] : null;
  const confidence = hasData ? (validatedResult.confidence * 100).toFixed(0) : 0;
  const isHighConfidence = hasData && validatedResult.confidence > 0.7;
  const hasError = !!error;

  const handleSetReminderClick = () => {
    if (hasDetectedMedicine) {
      onSetReminder(detectedMedicine);
    } else {
      setShowReminderConfirmation(true);
      speak("Please confirm the medicine name before setting a reminder");
    }
  };

  const handleConfirmReminder = () => {
    if (medicineName.trim()) {
      onSetReminder({ name: medicineName.trim() });
      setMedicineName('');
      setShowReminderConfirmation(false);
    }
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 
            className="text-2xl font-bold text-gray-900"
            style={{ 
              fontSize: `${fontSizeMultiplier * 20}px`,
              color: highContrast ? 'black' : '#111827'
            }}
          >
            📊 Scan Results
          </h2>
        </div>
        
        {/* Loading State Card */}
        <div 
          className="rounded-xl shadow-lg overflow-hidden"
          style={{
            border: highContrast ? '3px solid black' : '2px solid #bfdbfe',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          <div 
            className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50"
            style={{
              background: highContrast 
                ? '#f3f4f6' 
                : 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)',
              padding: '32px',
              textAlign: 'center'
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <div 
                className="mb-4 text-5xl animate-spin"
                role="status"
                aria-live="polite"
              >
                ⏳
              </div>
              <h3 
                className="text-2xl font-bold mb-2"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 24}px`,
                  color: highContrast ? 'black' : '#1e40af'
                }}
              >
                Processing Image...
              </h3>
              <p 
                className="text-lg"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 16}px`,
                  color: highContrast ? 'black' : '#1e3a8a'
                }}
              >
                Analyzing medicine packaging and extracting information
              </p>
              <div className="mt-6 w-full max-w-sm">
                <div 
                  className="h-2 bg-gray-200 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: highContrast ? '#d1d5db' : '#e0e7ff'
                  }}
                >
                  <div 
                    className="h-full bg-blue-500 animate-pulse"
                    style={{
                      backgroundColor: highContrast ? 'black' : '#3b82f6',
                      width: '60%'
                    }}
                  />
                </div>
                <p 
                  className="text-center mt-2 text-sm"
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 14}px`,
                    color: highContrast ? 'black' : '#666'
                  }}
                >
                  Please wait while OCR processes your image
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (hasError) {
    console.error('[MedicineScanResult] Rendering error state:', error);
    return (
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 
            className="text-2xl font-bold text-gray-900"
            style={{ 
              fontSize: `${fontSizeMultiplier * 20}px`,
              color: highContrast ? 'black' : '#111827'
            }}
          >
            📊 Scan Results
          </h2>
          <Button 
            variant="outline" 
            onClick={onScanAgain}
            aria-label="Try scanning again"
            style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
          >
            🔄 Try Again
          </Button>
        </div>

        {/* Error State Card */}
        <div 
          className="rounded-xl shadow-lg overflow-hidden"
          style={{
            border: highContrast ? '3px solid black' : '2px solid #fca5a5',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          <div 
            className="p-8 bg-gradient-to-r from-red-50 to-orange-50"
            style={{
              background: highContrast 
                ? '#f3f4f6' 
                : 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)',
              padding: '32px'
            }}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">❌</div>
              <div className="flex-1">
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 24}px`,
                    color: highContrast ? 'black' : '#991b1b'
                  }}
                >
                  Scan Failed
                </h3>
                <p 
                  className="text-lg mb-4"
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 16}px`,
                    color: highContrast ? 'black' : '#7f1d1d'
                  }}
                >
                  {error || 'An unexpected error occurred while processing your image.'}
                </p>
                <p 
                  className="text-lg"
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 16}px`,
                    color: highContrast ? 'black' : '#7f1d1d'
                  }}
                >
                  Please try the following:
                </p>
                <ul 
                  className="list-disc pl-5 mt-3 space-y-2"
                  style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
                >
                  <li>📸 Make sure your image is clear and well-lit</li>
                  <li>🔍 Focus on the medicine label</li>
                  <li>♻️ Try uploading a different image</li>
                  <li>🔄 Refresh the page if the problem persists</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NO DATA STATE (before scan or after reset)
  if (!hasData) {
    return (
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 
          className="text-2xl font-bold text-gray-900 mb-6"
          style={{ 
            fontSize: `${fontSizeMultiplier * 20}px`,
            color: highContrast ? 'black' : '#111827'
          }}
        >
          📊 Scan Results
        </h2>

        {/* Empty State Card */}
        <div 
          className="rounded-xl shadow-lg overflow-hidden"
          style={{
            border: highContrast ? '3px solid black' : '2px solid #d1d5db',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          <div 
            className="p-12 bg-gradient-to-r from-gray-50 to-slate-50 text-center"
            style={{
              background: highContrast 
                ? '#f3f4f6' 
                : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
              padding: '48px 32px'
            }}
          >
            <div className="text-6xl mb-4">📷</div>
            <h3 
              className="text-2xl font-bold mb-3"
              style={{ 
                fontSize: `${fontSizeMultiplier * 24}px`,
                color: highContrast ? 'black' : '#374151'
              }}
            >
              No Scan Results Yet
            </h3>
            <p 
              className="text-lg mb-6"
              style={{ 
                fontSize: `${fontSizeMultiplier * 16}px`,
                color: highContrast ? 'black' : '#6b7280'
              }}
            >
              Take a picture of a medicine package or upload an image to get started.
            </p>
            <p 
              className="text-base"
              style={{ 
                fontSize: `${fontSizeMultiplier * 14}px`,
                color: highContrast ? 'black' : '#6b7280'
              }}
            >
              ☀️ Good lighting, 🔍 clear focus, and 📸 straight angles give best results
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS STATE (has valid data)
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-2xl font-bold text-gray-900"
          style={{ 
            fontSize: `${fontSizeMultiplier * 20}px`,
            color: highContrast ? 'black' : '#111827'
          }}
        >
          📊 Scan Results
        </h2>
        <div className="flex gap-3 flex-wrap">
          <Button 
            variant="primary" 
            onClick={handleSetReminderClick}
            aria-label="Set a reminder for this medicine"
            style={{
              fontSize: `${fontSizeMultiplier * 16}px`,
              padding: '12px 20px',
              minWidth: '150px'
            }}
          >
            ⏰ Set Reminder
          </Button>
          <Button 
            variant="outline" 
            onClick={onScanAgain}
            aria-label="Scan another medicine"
            style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
          >
            🔄 Scan Again
          </Button>
        </div>
      </div>

      {/* Medicine Detected - High Confidence */}
      {hasDetectedMedicine && isHighConfidence ? (
        <div 
          className="rounded-xl shadow-lg overflow-hidden"
          style={{
            border: highContrast ? '3px solid black' : '2px solid #86efac',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          {/* Success Header */}
          <div 
            className="p-6 bg-gradient-to-r from-green-50 to-emerald-50"
            style={{
              background: highContrast 
                ? '#f3f4f6' 
                : 'linear-gradient(135deg, #f0fdf4 0%, #f0fdf4 100%)',
              padding: '24px',
              borderBottom: highContrast ? '3px solid black' : '2px solid #86efac'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="text-4xl"
                  role="img"
                  aria-label="Success"
                >
                  ✅
                </div>
                <div>
                  <h3 
                    className="text-2xl font-bold mb-1"
                    style={{ 
                      fontSize: `${fontSizeMultiplier * 24}px`,
                      color: highContrast ? 'black' : '#166534'
                    }}
                  >
                    Medicine Detected
                  </h3>
                  <p 
                    className="text-lg font-medium"
                    style={{ 
                      fontSize: `${fontSizeMultiplier * 16}px`,
                      color: highContrast ? 'black' : '#059669'
                    }}
                  >
                    Confidence: <span className="font-bold">{confidence}%</span>
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => onListen(`Medicine: ${detectedMedicine.name}. Dosage: ${detectedMedicine.dosage}. Usage: ${detectedMedicine.usage}.`)}
                aria-label={`Listen to ${detectedMedicine.name} information`}
                style={{
                  fontSize: `${fontSizeMultiplier * 14}px`,
                  padding: '10px 16px'
                }}
              >
                🔊 Listen
              </Button>
            </div>
          </div>

          {/* Medicine Information Cards */}
          <div className="p-6 space-y-6 bg-white">
            {/* Medicine Name */}
            <div 
              className="rounded-lg p-4"
              style={{
                backgroundColor: highContrast ? '#e5e7eb' : '#f0fdf4',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: highContrast ? '4px solid black' : '4px solid #10b981'
              }}
            >
              <h4 
                className="font-bold text-lg mb-2 flex items-center gap-2"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 18}px`,
                  color: highContrast ? 'black' : '#047857'
                }}
              >
                <span role="img" aria-label="Medicine">💊</span> Medicine Name
              </h4>
              <p 
                className="text-2xl font-bold"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 22}px`,
                  color: highContrast ? 'black' : '#065f46'
                }}
              >
                {detectedMedicine.name}
              </p>
            </div>

            {/* Two Column Layout for Dosage and Uses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dosage */}
              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: highContrast ? '#e5e7eb' : '#fef3c7',
                  padding: '16px',
                  borderRadius: '8px',
                  borderLeft: highContrast ? '4px solid black' : '4px solid #f59e0b'
                }}
              >
                <h4 
                  className="font-bold text-lg mb-3 flex items-center gap-2"
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 18}px`,
                    color: highContrast ? 'black' : '#92400e'
                  }}
                >
                  <span role="img" aria-label="Dosage">💉</span> Dosage
                </h4>
                <p 
                  className="text-lg"
                  style={{ fontSize: `${fontSizeMultiplier * 18}px` }}
                >
                  {detectedMedicine.dosage}
                </p>
              </div>

              {/* Uses */}
              <div 
                className="rounded-lg p-4"
                style={{
                  backgroundColor: highContrast ? '#e5e7eb' : '#dbeafe',
                  padding: '16px',
                  borderRadius: '8px',
                  borderLeft: highContrast ? '4px solid black' : '4px solid #3b82f6'
                }}
              >
                <h4 
                  className="font-bold text-lg mb-3 flex items-center gap-2"
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 18}px`,
                    color: highContrast ? 'black' : '#1e3a8a'
                  }}
                >
                  <span role="img" aria-label="Uses">📋</span> Uses
                </h4>
                <p 
                  className="text-lg"
                  style={{ fontSize: `${fontSizeMultiplier * 18}px` }}
                >
                  {detectedMedicine.usage}
                </p>
              </div>
            </div>

            {/* Side Effects */}
            <div 
              className="rounded-lg p-4"
              style={{
                backgroundColor: highContrast ? '#e5e7eb' : '#fee2e2',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: highContrast ? '4px solid black' : '4px solid #ef4444'
              }}
            >
              <h4 
                className="font-bold text-lg mb-3 flex items-center gap-2"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 18}px`,
                  color: highContrast ? 'black' : '#7f1d1d'
                }}
              >
                <span role="img" aria-label="Side Effects">⚠️</span> Side Effects
              </h4>
              <ul 
                className="space-y-2"
                role="list"
              >
                {detectedMedicine.sideEffects?.map((effect, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3"
                    style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
                  >
                    <span 
                      className="text-red-500 font-bold mt-1"
                      style={{ color: highContrast ? 'black' : '#dc2626' }}
                    >
                      •
                    </span>
                    <span>{effect}</span>
                  </li>
                )) || (
                  <li style={{ fontSize: `${fontSizeMultiplier * 16}px` }}>
                    No significant side effects reported
                  </li>
                )}
              </ul>
            </div>

            {/* Precautions */}
            <div 
              className="rounded-lg p-4"
              style={{
                backgroundColor: highContrast ? '#e5e7eb' : '#f5f3ff',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: highContrast ? '4px solid black' : '4px solid #8b5cf6'
              }}
            >
              <h4 
                className="font-bold text-lg mb-3 flex items-center gap-2"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 18}px`,
                  color: highContrast ? 'black' : '#5b21b6'
                }}
              >
                <span role="img" aria-label="Precautions">🛡️</span> Precautions
              </h4>
              <ul 
                className="space-y-2"
                role="list"
              >
                {detectedMedicine.precautions?.map((precaution, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3"
                    style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
                  >
                    <span 
                      className="text-purple-600 font-bold mt-1"
                      style={{ color: highContrast ? 'black' : '#a855f7' }}
                    >
                      ▸
                    </span>
                    <span>{precaution}</span>
                  </li>
                )) || (
                  <li style={{ fontSize: `${fontSizeMultiplier * 16}px` }}>
                    Follow standard precautions
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 flex gap-4 flex-wrap"
            style={{
              background: highContrast 
                ? '#f3f4f6' 
                : 'linear-gradient(135deg, #f0fdf4 0%, #f0fdf4 100%)',
              padding: '24px',
              borderTop: highContrast ? '3px solid black' : '2px solid #86efac'
            }}
          >
            <Button 
              variant="primary" 
              onClick={handleSetReminderClick}
              aria-label={`Set reminder for ${detectedMedicine.name}`}
              style={{
                fontSize: `${fontSizeMultiplier * 16}px`,
                padding: '12px 24px'
              }}
            >
              ⏰ Set Reminder for {detectedMedicine.name}
            </Button>
          </div>
        </div>
      ) : (
        /* Medicine Not Detected or Low Confidence */
        <div 
          className="rounded-xl shadow-lg overflow-hidden"
          style={{
            border: highContrast ? '3px solid black' : '2px solid #fbbf24',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          {/* Warning Header */}
          <div 
            className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50"
            style={{
              background: highContrast 
                ? '#f3f4f6' 
                : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              padding: '24px',
              borderBottom: highContrast ? '3px solid black' : '2px solid #fbbf24'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="text-4xl"
                  role="img"
                  aria-label="Alert"
                >
                  ⚠️
                </div>
                <div>
                  <h3 
                    className="text-2xl font-bold mb-1"
                    style={{ 
                      fontSize: `${fontSizeMultiplier * 24}px`,
                      color: highContrast ? 'black' : '#92400e'
                    }}
                  >
                    {hasDetectedMedicine ? 'Low Confidence Detection' : 'Medicine Not Found'}
                  </h3>
                  <p 
                    className="text-lg font-medium"
                    style={{ 
                      fontSize: `${fontSizeMultiplier * 16}px`,
                      color: highContrast ? 'black' : '#b45309'
                    }}
                  >
                    Confidence: <span className="font-bold">{confidence}%</span>
                  </p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => onListen(validatedResult.rawText)}
                aria-label="Listen to extracted text"
                style={{
                  fontSize: `${fontSizeMultiplier * 14}px`,
                  padding: '10px 16px'
                }}
              >
                🔊 Listen
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6 bg-white">
            {/* Extracted Text */}
            <div 
              className="rounded-lg p-4"
              style={{
                backgroundColor: highContrast ? '#e5e7eb' : '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: highContrast ? '4px solid black' : '4px solid #6b7280'
              }}
            >
              <h4 
                className="font-bold text-lg mb-3 flex items-center gap-2"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 18}px`,
                  color: highContrast ? 'black' : '#374151'
                }}
              >
                <span role="img" aria-label="Text">📝</span> Extracted Text
              </h4>
              <p 
                className="text-lg leading-relaxed"
                style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
              >
                {validatedResult.rawText}
              </p>
            </div>

            {/* Suggestions Box */}
            <div 
              className="rounded-lg p-4"
              style={{
                backgroundColor: highContrast ? '#e5e7eb' : '#f0f9ff',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: highContrast ? '4px solid black' : '4px solid #06b6d4'
              }}
            >
              <h4 
                className="font-bold text-lg mb-4 flex items-center gap-2"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 18}px`,
                  color: highContrast ? 'black' : '#0369a1'
                }}
              >
                <span role="img" aria-label="Tips">💡</span> Suggestions for Better Results
              </h4>
              <ul 
                className="space-y-3"
                role="list"
              >
                <li 
                  className="flex items-start gap-3"
                  style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
                >
                  <span 
                    className="font-bold text-xl mt-0"
                    style={{ color: highContrast ? 'black' : '#06b6d4' }}
                  >
                    ☀️
                  </span>
                  <span>Ensure <strong>good lighting conditions</strong> - avoid shadows and glare</span>
                </li>
                <li 
                  className="flex items-start gap-3"
                  style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
                >
                  <span 
                    className="font-bold text-xl mt-0"
                    style={{ color: highContrast ? 'black' : '#06b6d4' }}
                  >
                    🔍
                  </span>
                  <span><strong>Focus clearly</strong> on the medicine name and dosage information</span>
                </li>
                <li 
                  className="flex items-start gap-3"
                  style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
                >
                  <span 
                    className="font-bold text-xl mt-0"
                    style={{ color: highContrast ? 'black' : '#06b6d4' }}
                  >
                    📸
                  </span>
                  <span>Try <strong>capturing from different angles</strong> for better clarity</span>
                </li>
                <li 
                  className="flex items-start gap-3"
                  style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
                >
                  <span 
                    className="font-bold text-xl mt-0"
                    style={{ color: highContrast ? 'black' : '#06b6d4' }}
                  >
                    🧼
                  </span>
                  <span><strong>Clean the package surface</strong> to improve text visibility</span>
                </li>
                <li 
                  className="flex items-start gap-3"
                  style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
                >
                  <span 
                    className="font-bold text-xl mt-0"
                    style={{ color: highContrast ? 'black' : '#06b6d4' }}
                  >
                    🔄
                  </span>
                  <span>Try scanning a <strong>different image</strong> of the same medicine</span>
                </li>
              </ul>
            </div>

            {/* Manual Medicine Name Input for Reminder */}
            <div 
              className="rounded-lg p-4"
              style={{
                backgroundColor: highContrast ? '#e5e7eb' : '#f3f4f6',
                padding: '16px',
                borderRadius: '8px',
                border: highContrast ? '2px solid black' : '1px solid #d1d5db'
              }}
            >
              <h4 
                className="font-bold text-lg mb-3 flex items-center gap-2"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 18}px`,
                  color: highContrast ? 'black' : '#374151'
                }}
              >
                <span role="img" aria-label="Confirm">✏️</span> Set Reminder
              </h4>
              <p 
                className="text-lg mb-3"
                style={{ 
                  fontSize: `${fontSizeMultiplier * 16}px`,
                  color: highContrast ? 'black' : '#666'
                }}
              >
                Unable to detect medicine automatically. Please enter the medicine name to set a reminder:
              </p>
              <div className="flex gap-3">
                <input 
                  type="text"
                  placeholder="Enter medicine name"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                  style={{
                    fontSize: `${fontSizeMultiplier * 16}px`,
                    borderColor: highContrast ? 'black' : '#d1d5db',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    focusRingColor: highContrast ? 'black' : '#3b82f6'
                  }}
                  aria-label="Medicine name input"
                />
                <Button 
                  variant="primary"
                  onClick={() => {
                    if (medicineName.trim()) {
                      onSetReminder({ name: medicineName.trim() });
                      setMedicineName('');
                    }
                  }}
                  style={{
                    fontSize: `${fontSizeMultiplier * 14}px`,
                    padding: '10px 20px'
                  }}
                  aria-label="Set reminder with this medicine name"
                >
                  Set Reminder
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 flex gap-4 flex-wrap"
            style={{
              background: highContrast 
                ? '#f3f4f6' 
                : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              padding: '24px',
              borderTop: highContrast ? '3px solid black' : '2px solid #fbbf24'
            }}
          >
            <Button 
              variant="outline" 
              onClick={onScanAgain}
              aria-label="Try scanning again with better image"
              style={{
                fontSize: `${fontSizeMultiplier * 16}px`,
                padding: '12px 24px'
              }}
            >
              📸 Try Again with Better Image
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Low Confidence Reminder */}
      {showReminderConfirmation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-labelledby="reminder-dialog-title"
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full"
            style={{
              padding: '24px',
              borderRadius: '12px',
              border: highContrast ? '3px solid black' : 'none'
            }}
          >
            <h3 
              id="reminder-dialog-title"
              className="text-2xl font-bold mb-4"
              style={{ 
                fontSize: `${fontSizeMultiplier * 20}px`,
                color: highContrast ? 'black' : '#111827'
              }}
            >
              Confirm Medicine Name
            </h3>
            <p 
              className="text-lg mb-6"
              style={{ 
                fontSize: `${fontSizeMultiplier * 16}px`,
                color: highContrast ? 'black' : '#666'
              }}
            >
              Please enter the medicine name to set a reminder:
            </p>
            <input 
              type="text"
              placeholder="Enter medicine name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 mb-6 focus:outline-none focus:ring-2"
              style={{
                fontSize: `${fontSizeMultiplier * 16}px`,
                borderColor: highContrast ? 'black' : '#d1d5db',
                padding: '12px 16px',
                borderRadius: '8px'
              }}
              aria-label="Confirm medicine name"
            />
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowReminderConfirmation(false);
                  setMedicineName('');
                }}
                style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleConfirmReminder}
                disabled={!medicineName.trim()}
                style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
              >
                Set Reminder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineScanResult;
