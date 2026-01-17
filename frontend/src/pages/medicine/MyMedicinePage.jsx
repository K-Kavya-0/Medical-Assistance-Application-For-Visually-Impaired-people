import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import EmergencyButton from '../../components/common/EmergencyButton';
import useAccessibility from '../../hooks/useAccessibility';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';

const MyMedicinePage = () => {
  const [scannedMedicines, setScannedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const { speak } = useAccessibility();
  const { fontSizeMultiplier, highContrast } = useAccessibilitySettings();

  // Mock data for demonstration - in real app this would come from localStorage or backend
  const mockScannedMedicines = [
    {
      id: 1,
      name: "Paracetamol",
      scanCount: 3,
      lastScanned: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      details: {
        dosage: "Take 1-2 tablets every 4-6 hours",
        uses: "Pain relief and fever reduction",
        sideEffects: ["Nausea", "Stomach upset"],
        precautions: ["Do not exceed 4g per day"]
      }
    },
    {
      id: 2,
      name: "Amoxicillin",
      scanCount: 1,
      lastScanned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      details: {
        dosage: "Take one capsule three times daily",
        uses: "Antibiotic for bacterial infections",
        sideEffects: ["Diarrhea", "Nausea"],
        precautions: ["Complete full course"]
      }
    },
    {
      id: 3,
      name: "Lisinopril",
      scanCount: 2,
      lastScanned: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      details: {
        dosage: "Take one tablet daily in the morning",
        uses: "Blood pressure medication",
        sideEffects: ["Dizziness", "Headache"],
        precautions: ["Monitor blood pressure regularly"]
      }
    }
  ];

  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    
    // Load scanned medicines
    const loadScannedMedicines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Small delay to ensure UI updates
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if component is still mounted before proceeding
        if (!isMounted) return;
        
        // Load from localStorage
        const storedMedicines = localStorage.getItem('scannedMedicines');
        let medicines = [];
        
        if (storedMedicines) {
          try {
            medicines = JSON.parse(storedMedicines);
          } catch (parseError) {
            console.error('Error parsing stored medicines:', parseError);
            // Use empty array if parsing fails
            medicines = [];
          }
        }
        
        // Validate medicines array - handle null, undefined, and non-array types
        if (!Array.isArray(medicines)) {
          medicines = [];
        }
        
        // Filter out invalid entries
        medicines = medicines.filter(med => med && typeof med === 'object');
        
        // Convert string dates back to Date objects
        medicines = medicines.map(med => ({
          ...med,
          lastScanned: typeof med.lastScanned === 'string' ? new Date(med.lastScanned) : med.lastScanned
        }));
        
        // Update state only if component is still mounted
        if (isMounted) {
          setScannedMedicines(medicines);
          setLoading(false);
          setError(null);
          
          // Only speak if medicines exist
          if (medicines && medicines.length > 0) {
            speak(`${medicines.length} medicines found in your scan history`);
          } else {
            speak('No medicines in your scan history');
          }
        }
      } catch (err) {
        console.error('Error loading medicines:', err);
        // Update state only if component is still mounted
        if (isMounted) {
          setError('Failed to load scan history. Please try again.');
          setScannedMedicines([]);
          setLoading(false);
          speak('Error loading medicine history');
        }
      }
    };

    loadScannedMedicines();
    
    // Cleanup function to set isMounted to false
    return () => {
      isMounted = false;
    };
  }, [speak]);  // Keep speak as dependency for accessibility announcements

  const handleMedicineClick = (medicine) => {
    if (!medicine || !medicine.name) return;
    setSelectedMedicine(medicine);
    const lastScannedText = medicine.lastScanned ? medicine.lastScanned.toLocaleDateString() : 'Unknown date';
    speak(`Selected ${medicine.name}. Scanned ${medicine.scanCount || 0} times. Last scanned ${lastScannedText}`);
  };

  const handleCloseDetails = () => {
    setSelectedMedicine(null);
  };

  const handleSetReminder = (medicine) => {
    if (!medicine || !medicine.name) return;
    speak(`Opening reminder setup for ${medicine.name}`);
    // In a real app, this would navigate to reminder setup or open a modal
    console.log('Setting reminder for:', medicine);
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    try {
      return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setSelectedMedicine(null);
    
    // Retry loading medicines
    const retryLoad = async () => {
      let isMounted = true;
      try {
        // Small delay to ensure UI updates
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if component is still mounted
        if (!isMounted) return;
        
        const storedMedicines = localStorage.getItem('scannedMedicines');
        let medicines = [];
        
        if (storedMedicines) {
          try {
            medicines = JSON.parse(storedMedicines);
          } catch (parseError) {
            console.error('Error parsing stored medicines on retry:', parseError);
            medicines = [];
          }
        }
        
        // Validate medicines array - handle null, undefined, and non-array types
        if (!Array.isArray(medicines)) {
          medicines = [];
        }
        
        // Filter out invalid entries
        medicines = medicines.filter(med => med && typeof med === 'object');
        
        // Convert string dates back to Date objects
        medicines = medicines.map(med => ({
          ...med,
          lastScanned: typeof med.lastScanned === 'string' ? new Date(med.lastScanned) : med.lastScanned
        }));
        
        if (isMounted) {
          setScannedMedicines(medicines);
          setLoading(false);
          setError(null);
          speak('Scan history reloaded successfully');
        }
      } catch (err) {
        console.error('Error retrying:', err);
        if (isMounted) {
          setError('Failed to reload. Please try again.');
          setScannedMedicines([]);
          setLoading(false);
          speak('Error reloading medicine history');
        }
      }
      
      // Cleanup mounted flag
      return () => {
        isMounted = false;
      };
    };
    
    retryLoad();
  };

  // Function to add a new scanned medicine or increment count for existing
  const addScannedMedicine = (medicineName, medicineDetails = null) => {
    if (!medicineName) return;
    const now = new Date();
    setScannedMedicines(prevMedicines => {
      if (!Array.isArray(prevMedicines)) {
        prevMedicines = [];
      }
      const existingIndex = prevMedicines.findIndex(med => med.name.toLowerCase() === medicineName.toLowerCase());
      
      if (existingIndex >= 0) {
        // Increment scan count for existing medicine
        const updatedMedicines = [...prevMedicines];
        updatedMedicines[existingIndex] = {
          ...updatedMedicines[existingIndex],
          scanCount: (updatedMedicines[existingIndex].scanCount || 0) + 1,
          lastScanned: now,
          details: medicineDetails || updatedMedicines[existingIndex].details
        };
        
        // Update localStorage
        localStorage.setItem('scannedMedicines', JSON.stringify(updatedMedicines));
        
        return updatedMedicines;
      } else {
        // Add new medicine
        const newMedicine = {
          id: Date.now(),
          name: medicineName,
          scanCount: 1,
          lastScanned: now,
          details: medicineDetails
        };
        
        const updatedMedicines = [...prevMedicines, newMedicine];
        
        // Update localStorage
        localStorage.setItem('scannedMedicines', JSON.stringify(updatedMedicines));
        
        return updatedMedicines;
      }
    });
  };



  // Always render one of the four states: Loading, Success, Empty, or Error
  return (
    <div 
      className="my-medicine-page max-w-4xl mx-auto p-4"
      style={{
        fontSize: `${fontSizeMultiplier * 16}px`,
        minHeight: '100vh',
        backgroundColor: highContrast ? '#ffffff' : '#f8fafc'
      }}
    >
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ 
            fontSize: `${fontSizeMultiplier * 36}px`,
            color: highContrast ? '#000000' : '#1e40af',
            borderBottom: highContrast ? '4px solid #000000' : '4px solid #3b82f6',
            paddingBottom: '10px'
          }}
        >
          📋 My Medicine History
        </h1>
        <p 
          className="text-lg"
          style={{ 
            fontSize: `${fontSizeMultiplier * 20}px`,
            color: highContrast ? '#000000' : '#64748b'
          }}
        >
          Your scanned medicine history and reminders
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div 
          className="flex flex-col items-center justify-center py-20"
          style={{
            minHeight: '400px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: highContrast ? '2px solid #000000' : '1px solid #e2e8f0',
            padding: '40px'
          }}
        >
          <LoadingSpinner size="lg" />
          <p 
            className="mt-6 text-xl"
            style={{ 
              fontSize: `${fontSizeMultiplier * 24}px`,
              color: highContrast ? '#000000' : '#475569'
            }}
          >
            Loading your medicine history...
          </p>
          <p 
            className="mt-2 text-gray-500"
            style={{ 
              fontSize: `${fontSizeMultiplier * 18}px`,
              color: highContrast ? '#000000' : '#94a3b8'
            }}
          >
            Please wait while we fetch your scan history
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div 
          className="py-8"
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: highContrast ? '3px solid #000000' : '1px solid #fecaca',
            padding: '30px'
          }}
        >
          <Alert variant="error">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg 
                  className="h-5 w-5 text-red-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  style={{ 
                    width: `${fontSizeMultiplier * 20}px`, 
                    height: `${fontSizeMultiplier * 20}px`,
                    color: '#f87171'
                  }}
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 
                  className="text-lg font-medium"
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 22}px`,
                    color: highContrast ? '#000000' : '#b91c1c',
                    marginBottom: '10px'
                  }}
                >
                  Unable to Load Medicine History
                </h3>
                <div 
                  className="mt-2 text-sm"
                  style={{ fontSize: `${fontSizeMultiplier * 18}px` }}
                >
                  <p style={{ color: highContrast ? '#000000' : '#b91c1c', marginBottom: '15px' }}>
                    {error || 'An unexpected error occurred while loading your medicine history.'}
                  </p>
                  <p style={{ color: highContrast ? '#000000' : '#991b1b', marginBottom: '15px', fontSize: `${fontSizeMultiplier * 16}px` }}>
                    Please ensure you have internet connectivity and try again.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button 
                      variant="primary" 
                      onClick={handleRetry}
                      style={{
                        fontSize: `${fontSizeMultiplier * 16}px`,
                        padding: '10px 20px'
                      }}
                    >
                      🔄 Retry Loading
                    </Button>
                    <Link to="/scan">
                      <Button 
                        variant="outline"
                        style={{
                          fontSize: `${fontSizeMultiplier * 16}px`,
                          padding: '10px 20px'
                        }}
                      >
                        📷 Scan New Medicine
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Alert>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && scannedMedicines.length === 0 && (
        <div 
          className="text-center py-16"
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: highContrast ? '2px solid #000000' : '1px solid #e2e8f0',
            padding: '60px 30px'
          }}
        >
          <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-24 w-24"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ 
                width: `${fontSizeMultiplier * 96}px`, 
                height: `${fontSizeMultiplier * 96}px`,
                color: highContrast ? '#000000' : '#cbd5e1'
              }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
          </div>
          <h3 
            className="mt-4 text-xl font-medium"
            style={{ 
              fontSize: `${fontSizeMultiplier * 24}px`,
              color: highContrast ? '#000000' : '#374151',
              marginBottom: '12px'
            }}
          >
            No Medicines Scanned Yet
          </h3>
          <p 
            className="mt-2 text-gray-500"
            style={{ 
              fontSize: `${fontSizeMultiplier * 18}px`,
              color: highContrast ? '#000000' : '#6b7280',
              marginBottom: '24px'
            }}
          >
            Start building your medicine history by scanning your medications
          </p>
          <div className="mt-6">
            <Link to="/scan">
              <Button 
                variant="primary" 
                size="lg"
                style={{
                  fontSize: `${fontSizeMultiplier * 16}px`,
                  padding: '12px 24px'
                }}
              >
                📷 Scan Medicine
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Success State - Medicine List */}
      {!loading && !error && scannedMedicines && Array.isArray(scannedMedicines) && scannedMedicines.length > 0 && (
        <div className="space-y-4">
          <div 
            className="grid gap-4"
            style={{ 
              display: 'grid',
              gap: '16px'
            }}
          >
            {scannedMedicines.map((medicine) => {
              // Validate medicine data before rendering - defensive checks
              if (!medicine || typeof medicine !== 'object' || !medicine.id || !medicine.name) {
                console.warn('Skipping invalid medicine entry:', medicine);
                return null;
              }
              return (
              <Card 
                key={medicine.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: highContrast ? '3px solid #000000' : '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  transition: 'box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => handleMedicineClick(medicine)}
                tabIndex="0"
                role="button"
                aria-label={`View details for ${medicine.name}, scanned ${medicine.scanCount || 0} times, last scanned ${formatDate(medicine.lastScanned)}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMedicineClick(medicine);
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 
                      className="text-lg font-bold mb-2"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 22}px`,
                        color: highContrast ? '#000000' : '#1e40af',
                        marginBottom: '8px'
                      }}
                    >
                      💊 {medicine.name}
                    </h3>
                    <div 
                      className="flex items-center space-x-4 text-sm"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 16}px`,
                        color: highContrast ? '#000000' : '#64748b'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '6px' }}>🔢</span>
                        Scanned {medicine.scanCount || 0} {(medicine.scanCount || 0) === 1 ? 'time' : 'times'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '6px' }}>🕐</span>
                        {formatDate(medicine.lastScanned)}
                      </span>
                    </div>
                  </div>
                  <div 
                    className="text-blue-600"
                    style={{ 
                      fontSize: `${fontSizeMultiplier * 24}px`,
                      color: highContrast ? '#000000' : '#2563eb'
                    }}
                  >
                    →
                  </div>
                </div>
              </Card>
            );
            })}
          </div>

          {/* Scan New Medicine Button */}
          <div className="mt-8 text-center">
            <Link to="/scan">
              <Button 
                variant="primary" 
                size="lg"
                style={{
                  fontSize: `${fontSizeMultiplier * 18}px`,
                  padding: '15px 30px',
                  minWidth: '250px'
                }}
              >
                ➕ Scan New Medicine
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Medicine Details Modal */}
      {selectedMedicine && selectedMedicine.id && selectedMedicine.name && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 1000 }}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full"
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              border: highContrast ? '3px solid #000000' : 'none'
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="medicine-details-title"
          >
            <h2 
              id="medicine-details-title"
              className="text-xl font-bold mb-4"
              style={{ 
                fontSize: `${fontSizeMultiplier * 24}px`,
                color: highContrast ? '#000000' : '#1f2937',
                marginBottom: '16px'
              }}
            >
              💊 {selectedMedicine.name} Details
            </h2>

            <div className="space-y-4">
              <div>
                <p 
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 16}px`,
                    color: highContrast ? '#000000' : '#6b7280',
                    marginBottom: '4px'
                  }}
                >
                  <strong>📊 Total Scans:</strong> {selectedMedicine.scanCount || 0}
                </p>
                <p 
                  style={{ 
                    fontSize: `${fontSizeMultiplier * 16}px`,
                    color: highContrast ? '#000000' : '#6b7280'
                  }}
                >
                  <strong>🕐 Last Scanned:</strong> {formatDate(selectedMedicine.lastScanned)}
                </p>
              </div>

              {selectedMedicine.details && (
                <div className="space-y-3">
                  <div>
                    <h4 
                      className="font-semibold"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 18}px`,
                        color: highContrast ? '#000000' : '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      💉 Dosage
                    </h4>
                    <p 
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 16}px`,
                        color: highContrast ? '#000000' : '#6b7280'
                      }}
                    >
                      {selectedMedicine.details.dosage || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h4 
                      className="font-semibold"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 18}px`,
                        color: highContrast ? '#000000' : '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      🎯 Uses
                    </h4>
                    <p 
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 16}px`,
                        color: highContrast ? '#000000' : '#6b7280'
                      }}
                    >
                      {selectedMedicine.details.uses || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h4 
                      className="font-semibold"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 18}px`,
                        color: highContrast ? '#000000' : '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      ⚠️ Side Effects
                    </h4>
                    <ul className="list-disc list-inside">
                      {selectedMedicine.details.sideEffects && Array.isArray(selectedMedicine.details.sideEffects) && selectedMedicine.details.sideEffects.length > 0 ? (
                        selectedMedicine.details.sideEffects.map((effect, index) => (
                          <li 
                            key={index}
                            style={{ 
                              fontSize: `${fontSizeMultiplier * 16}px`,
                              color: highContrast ? '#000000' : '#6b7280'
                            }}
                          >
                            {effect}
                          </li>
                        ))
                      ) : (
                        <li 
                          style={{ 
                            fontSize: `${fontSizeMultiplier * 16}px`,
                            color: highContrast ? '#000000' : '#6b7280'
                          }}
                        >
                          None reported
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={handleCloseDetails}
                style={{ 
                  fontSize: `${fontSizeMultiplier * 16}px`,
                  padding: '10px 20px'
                }}
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleSetReminder(selectedMedicine)}
                style={{ 
                  fontSize: `${fontSizeMultiplier * 16}px`,
                  padding: '10px 20px'
                }}
              >
                ⏰ Set/Edit Reminder
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Call Button */}
      <EmergencyButton 
        helplineNumber="+1-911"
        displayNumber="911"
      />
    </div>
  );
};

export default MyMedicinePage;