import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import CameraCapture from '../../components/ocr/CameraCapture';
import ImageUpload from '../../components/ocr/ImageUpload';
import MedicineScanResult from '../../components/ocr/MedicineScanResult';
import ScanErrorBoundary from '../../components/ocr/ScanErrorBoundary';
import { Button } from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import useAccessibility from '../../hooks/useAccessibility';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';
import ReminderModal from '../../components/reminders/ReminderModal';

const ScanPage = () => {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'upload'
  const [isLoading, setIsLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [autoOpenReminder, setAutoOpenReminder] = useState(false);
  const [detectedMedicine, setDetectedMedicine] = useState(null);
  const { speak } = useAccessibility();
  const { fontSizeMultiplier, highContrast } = useAccessibilitySettings();

  const handleCapture = async (imageFile) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the backend API
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate OCR result with higher confidence
      const mockResult = {
        rawText: "Paracetamol 500mg tablets. Take 1-2 tablets every 4-6 hours as needed for pain or fever. Do not exceed 8 tablets in 24 hours.",
        confidence: 0.92,
        medicines: [
          {
            id: 1,
            name: "Paracetamol",
            activeIngredients: ["Paracetamol 500mg"],
            dosage: "Take 1-2 tablets every 4-6 hours",
            usage: "As needed for pain or fever. Do not exceed 8 tablets in 24 hours.",
            sideEffects: ["Nausea", "Stomach pain", "Liver damage if taken in excess"],
            precautions: ["Avoid alcohol while taking this medicine", "Consult doctor if symptoms persist for more than 3 days"]
          }
        ]
      };
      
      setOcrResult(mockResult);
      setDetectedMedicine(mockResult.medicines[0]);
      setAutoOpenReminder(true);
      
      // Save to My Medicine history
      addToMyMedicine(mockResult.medicines[0]);
      
      speak(`OCR scan completed. Found ${mockResult.medicines[0].name} medicine with dosage instructions. Opening reminder setup.`);
    } catch (err) {
      setError(err.message || 'Failed to process image');
      speak("Error processing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (imageFile) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the backend API
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate OCR result with lower confidence
      const mockResult = {
        rawText: "Some medicine text here but not clearly identified",
        confidence: 0.35,
        medicines: []
      };
      
      setOcrResult(mockResult);
      setDetectedMedicine(null);
      
      // Even if medicine isn't clearly identified, we can still save the scan event
      // For now, we won't save to My Medicine if no medicine was detected
      
      // Extract potential medicine name from raw text (first word that looks like medicine)
      const text = mockResult.rawText;
      const words = text.split(/[\s\n]/);
      const potentialMedicineName = words.find(word => word.length > 3 && /[a-zA-Z]/.test(word)) || 'Unknown Medicine';
      
      const unknownMedicine = {
        name: potentialMedicineName,
        dosage: '',
        usage: 'Information not available',
        sideEffects: [],
        precautions: []
      };
      addToMyMedicine(unknownMedicine);
      
      speak("Image processed but medicine not clearly identified. Please try again with better lighting or focus.");
    } catch (err) {
      setError(err.message || 'Failed to process image');
      speak("Error processing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOcrResult(null);
    setError(null);
    setDetectedMedicine(null);
    setShowReminderModal(false);
  };

  const handleSetReminder = () => {
    if (detectedMedicine) {
      setShowReminderModal(true);
      speak(`Setting reminder for ${detectedMedicine.name}`);
    } else {
      // Prompt user to confirm medicine name
      const medicineName = prompt("Please enter the medicine name to set reminder:");
      if (medicineName) {
        setShowReminderModal(true);
        speak(`Setting reminder for ${medicineName}`);
      }
    }
  };

  const handleSaveReminder = (reminderData) => {
    console.log('Saving reminder:', reminderData);
    speak(`Reminder saved for ${reminderData.medicineName} at ${reminderData.time}`);
    // Here you would typically save to your data store
  };

  const handleListen = (text) => {
    speak(text);
  };

  const closeReminderModal = () => {
    setShowReminderModal(false);
    setAutoOpenReminder(false);
  };

  const addToMyMedicine = (medicine) => {
    const now = new Date();
    const storedMedicines = localStorage.getItem('scannedMedicines');
    const medicines = storedMedicines ? JSON.parse(storedMedicines) : [];
    
    const existingIndex = medicines.findIndex(med => med.name.toLowerCase() === medicine.name.toLowerCase());
    
    if (existingIndex >= 0) {
      // Increment scan count for existing medicine
      medicines[existingIndex].scanCount += 1;
      medicines[existingIndex].lastScanned = now;
    } else {
      // Add new medicine
      const newMedicine = {
        id: Date.now(),
        name: medicine.name,
        scanCount: 1,
        lastScanned: now,
        details: {
          dosage: medicine.dosage,
          uses: medicine.usage,
          sideEffects: medicine.sideEffects,
          precautions: medicine.precautions
        }
      };
      medicines.push(newMedicine);
    }
    
    localStorage.setItem('scannedMedicines', JSON.stringify(medicines));
  };


  // Effect to automatically open reminder modal when medicine is detected
  useEffect(() => {
    if (autoOpenReminder && detectedMedicine) {
      setShowReminderModal(true);
      setAutoOpenReminder(false);
    }
  }, [autoOpenReminder, detectedMedicine]);

  return (
    <ScanErrorBoundary>
      <div 
        className="scan-page max-w-4xl mx-auto p-4"
        style={{
          fontSize: `${fontSizeMultiplier * 16}px`
        }}
      >
      <div className="mb-8 text-center">
        <h1 
          className={`text-3xl font-bold mb-2 ${highContrast ? 'text-black' : 'text-gray-900'}`}
          style={{ fontSize: `${fontSizeMultiplier * 30}px` }}
        >
          Medicine Scanner
        </h1>
        <p 
          className={`text-lg ${highContrast ? 'text-black' : 'text-gray-600'}`}
          style={{ fontSize: `${fontSizeMultiplier * 18}px` }}
        >
          Scan medicine packages to get detailed information and set reminders
        </p>
      </div>

      <Card className="p-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'camera'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('camera')}
            aria-selected={activeTab === 'camera'}
            role="tab"
            style={{ fontSize: `${fontSizeMultiplier * 14}px` }}
          >
            📷 Camera Scan
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upload')}
            aria-selected={activeTab === 'upload'}
            role="tab"
            style={{ fontSize: `${fontSizeMultiplier * 14}px` }}
          >
            🖼️ Upload Image
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'camera' && (
            <div className="camera-tab">
              <h2 
                className="text-xl font-semibold mb-4"
                style={{ fontSize: `${fontSizeMultiplier * 20}px` }}
              >
                Scan Using Camera
              </h2>
              <p 
                className={`mb-6 ${highContrast ? 'text-black' : 'text-gray-600'}`}
                style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
              >
                Point your camera at the medicine package and capture a clear image of the label
              </p>
              <CameraCapture onCapture={handleCapture} isLoading={isLoading} />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="upload-tab">
              <h2 
                className="text-xl font-semibold mb-4"
                style={{ fontSize: `${fontSizeMultiplier * 20}px` }}
              >
                Upload Medicine Image
              </h2>
              <p 
                className={`mb-6 ${highContrast ? 'text-black' : 'text-gray-600'}`}
                style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
              >
                Upload a clear photo of the medicine package or prescription
              </p>
              <ImageUpload onUpload={handleUpload} isLoading={isLoading} />
            </div>
          )}
        </div>

        {/* OCR Result Section */}
        <MedicineScanResult 
          ocrResult={ocrResult}
          error={error}
          isLoading={isLoading}
          onSetReminder={handleSetReminder}
          onScanAgain={handleReset}
          onListen={handleListen}
        />
      </Card>

      {/* Accessibility Tip */}
      <div 
        className="mt-6 p-4 rounded-lg"
        style={{
          backgroundColor: highContrast ? '#d1d5db' : '#dbeafe',
          border: highContrast ? '2px solid black' : '1px solid #bfdbfe',
          padding: '16px',
          borderRadius: '8px'
        }}
      >
        <h3 
          className="font-medium flex items-center"
          style={{ 
            fontSize: `${fontSizeMultiplier * 18}px`,
            color: highContrast ? 'black' : '#1e40af'
          }}
        >
          ♿ Accessibility Tip
        </h3>
        <p 
          className="mt-1"
          style={{ 
            fontSize: `${fontSizeMultiplier * 16}px`,
            color: highContrast ? 'black' : '#1e3a8a'
          }}
        >
          Press Ctrl+Shift+A to toggle audio descriptions for all text content on this page.
        </p>
      </div>

      {/* Reminder Modal */}
      <ReminderModal 
        isOpen={showReminderModal}
        onClose={closeReminderModal}
        medicineName={detectedMedicine?.name || ''}
        onSave={handleSaveReminder}
      />
      </div>
    </ScanErrorBoundary>
  );
};

export default ScanPage;