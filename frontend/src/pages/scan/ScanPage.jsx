import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import CameraCapture from '../../components/ocr/CameraCapture';
import ImageUpload from '../../components/ocr/ImageUpload';
import OCRResultDisplay from '../../components/ocr/OCRResultDisplay';
import { Button } from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import useAccessibility from '../../hooks/useAccessibility';

const ScanPage = () => {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'upload'
  const [isLoading, setIsLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const { speak } = useAccessibility();

  const handleCapture = async (imageFile) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the backend API
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate OCR result
      const mockResult = {
        rawText: "Paracetamol 500mg tablets. Take 1-2 tablets every 4-6 hours as needed for pain or fever. Do not exceed 8 tablets in 24 hours.",
        medicines: [
          {
            id: 1,
            name: "Paracetamol",
            activeIngredients: ["Paracetamol 500mg"],
            dosage: "Take 1-2 tablets every 4-6 hours",
            usage: "As needed for pain or fever. Do not exceed 8 tablets in 24 hours.",
            sideEffects: ["Nausea", "Stomach pain", "Liver damage if taken in excess"]
          }
        ]
      };
      
      setOcrResult(mockResult);
      speak("OCR scan completed. Found Paracetamol medicine with dosage instructions.");
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
      
      // Simulate OCR result
      const mockResult = {
        rawText: "Amoxicillin 250mg capsules. Take one capsule three times daily for bacterial infection. Complete full course even if feeling better.",
        medicines: [
          {
            id: 2,
            name: "Amoxicillin",
            activeIngredients: ["Amoxicillin 250mg"],
            dosage: "Take one capsule three times daily",
            usage: "For bacterial infection. Complete full course even if feeling better.",
            sideEffects: ["Diarrhea", "Nausea", "Skin rash"]
          }
        ]
      };
      
      setOcrResult(mockResult);
      speak("Image uploaded and processed. Found Amoxicillin medicine with dosage instructions.");
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
  };

  return (
    <div className="scan-page max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicine Scanner</h1>
        <p className="text-lg text-gray-600">
          Scan medicine packages to get detailed information about dosage, usage, and side effects
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
          >
            Camera Scan
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
          >
            Upload Image
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'camera' && (
            <div className="camera-tab">
              <h2 className="text-xl font-semibold mb-4">Scan Using Camera</h2>
              <p className="text-gray-600 mb-6">
                Point your camera at the medicine package and capture a clear image of the label
              </p>
              <CameraCapture onCapture={handleCapture} isLoading={isLoading} />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="upload-tab">
              <h2 className="text-xl font-semibold mb-4">Upload Medicine Image</h2>
              <p className="text-gray-600 mb-6">
                Upload a clear photo of the medicine package or prescription
              </p>
              <ImageUpload onUpload={handleUpload} isLoading={isLoading} />
            </div>
          )}
        </div>

        {/* OCR Result Section */}
        {(ocrResult || error) && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">OCR Results</h2>
              <Button variant="outline" onClick={handleReset}>
                Scan Another
              </Button>
            </div>
            
            <OCRResultDisplay 
              result={ocrResult} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        )}
      </Card>

      {/* Accessibility Tip */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Accessibility Tip
        </h3>
        <p className="text-blue-700 mt-1">
          Press Ctrl+Shift+A to toggle audio descriptions for all text content on this page.
        </p>
      </div>
    </div>
  );
};

export default ScanPage;