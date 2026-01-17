import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import EmergencyButton from '../../components/common/EmergencyButton';
import useAccessibility from '../../hooks/useAccessibility';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';

const MedicineListPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const { speak } = useAccessibility();
  const { fontSizeMultiplier, highContrast } = useAccessibilitySettings();

  // Mock data for demonstration
  const mockMedicines = [
    {
      id: 1,
      name: "Paracetamol",
      uses: "Pain relief and fever reduction",
      dosage: "Take 1-2 tablets every 4-6 hours as needed",
      sideEffects: ["Nausea", "Stomach upset", "Allergic reactions (rare)"],
      precautions: ["Do not exceed 4g per day", "Avoid alcohol", "Consult doctor if pregnant"],
      confidence: 0.95
    },
    {
      id: 2,
      name: "Amoxicillin",
      uses: "Antibiotic for bacterial infections",
      dosage: "Take one capsule three times daily",
      sideEffects: ["Diarrhea", "Nausea", "Skin rash"],
      precautions: ["Complete full course", "May cause yeast infections", "Inform about penicillin allergy"],
      confidence: 0.88
    },
    {
      id: 3,
      name: "Lisinopril",
      uses: "Blood pressure medication",
      dosage: "Take one tablet daily in the morning",
      sideEffects: ["Dizziness", "Headache", "Dry cough"],
      precautions: ["Monitor blood pressure", "Avoid potassium supplements", "Regular kidney function tests"],
      confidence: 0.92
    }
  ];

  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    
    // Simulate API call
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Only update state if component is still mounted
        if (!isMounted) return;
        
        // Validate response
        if (!Array.isArray(mockMedicines) || mockMedicines.length === 0) {
          setMedicines([]);
          setLoading(false);
          speak('No medicines available');
        } else {
          // Simulate successful API response with safe data
          setMedicines(mockMedicines);
          setLoading(false);
          speak(`${mockMedicines.length} medicines loaded successfully`);
        }
      } catch (err) {
        console.error('Error fetching medicines:', err);
        if (isMounted) {
          setError('Failed to load medicines. Please check your connection and try again.');
          setLoading(false);
          speak('Error loading medicines');
        }
      }
    };

    fetchMedicines();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);  // Empty dependency array - runs only once on mount

  const handleListen = (medicine) => {
    if (!medicine || !medicine.name) return;
    const sideEffectsText = medicine.sideEffects && Array.isArray(medicine.sideEffects) 
      ? medicine.sideEffects.join(', ') 
      : 'None reported';
    const precautionsText = medicine.precautions && Array.isArray(medicine.precautions)
      ? medicine.precautions.join(', ')
      : 'None';
    const text = `Medicine: ${medicine.name}. Uses: ${medicine.uses || 'Not specified'}. Dosage: ${medicine.dosage || 'Not specified'}. Side effects: ${sideEffectsText}. Precautions: ${precautionsText}`;
    speak(text);
  };

  const handleSetReminder = (medicine) => {
    if (!medicine || !medicine.name) return;
    setSelectedMedicine(medicine);
    setShowReminderModal(true);
    speak(`Setting reminder for ${medicine.name}`);
  };

  const closeReminderModal = () => {
    setShowReminderModal(false);
    setSelectedMedicine(null);
  };

  const handleRetry = () => {
    // Reset and try again
    setLoading(true);
    setError(null);
    setSelectedMedicine(null);
    
    const retryTimeout = setTimeout(() => {
      if (Array.isArray(mockMedicines) && mockMedicines.length > 0) {
        setMedicines(mockMedicines);
        setLoading(false);
        speak('Medicines reloaded successfully');
      } else {
        setMedicines([]);
        setLoading(false);
        speak('No medicines available');
      }
    }, 1000);
    
    // Return cleanup to clear timeout
    return () => clearTimeout(retryTimeout);
  };

  // Always render one of the four states: Loading, Success, Failure, or Error
  return (
    <div 
      className="medicine-list-page max-w-6xl mx-auto p-4"
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
          🏥 My Medicines
        </h1>
        <p 
          className="text-lg"
          style={{ 
            fontSize: `${fontSizeMultiplier * 20}px`,
            color: highContrast ? '#000000' : '#64748b'
          }}
        >
          Manage your medication information and set reminders
        </p>
      </div>

      {/* Loading State - Always visible when loading */}
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
            Loading your medicines...
          </p>
          <p 
            className="mt-2 text-gray-500"
            style={{ 
              fontSize: `${fontSizeMultiplier * 18}px`,
              color: highContrast ? '#000000' : '#94a3b8'
            }}
          >
            Please wait while we fetch your medication data
          </p>
        </div>
      )}

      {/* Error State - Always visible when there's an error */}
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
                  Unable to Load Medicines
                </h3>
                <div 
                  className="mt-2 text-sm"
                  style={{ fontSize: `${fontSizeMultiplier * 18}px` }}
                >
                  <p style={{ color: highContrast ? '#000000' : '#b91c1c', marginBottom: '15px' }}>
                    {error}
                  </p>
                  <div className="mt-4">
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
                  </div>
                </div>
              </div>
            </div>
          </Alert>
        </div>
      )}

      {/* Success State - Always visible when data is loaded */}
      {!loading && !error && medicines && Array.isArray(medicines) && medicines.length > 0 && (
        <div className="space-y-6">
          <div 
            className="grid gap-6"
            style={{ 
              display: 'grid',
              gap: '24px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
            }}
          >
            {medicines.map((medicine) => {
              // Validate medicine data before rendering
              if (!medicine || !medicine.id || !medicine.name) {
                return null;
              }
              return (
              <Card 
                key={medicine.id}
                className="p-6 hover:shadow-lg transition-shadow"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: highContrast ? '3px solid #000000' : '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 24}px`,
                        color: highContrast ? '#000000' : '#1e40af',
                        marginBottom: '8px'
                      }}
                    >
                      💊 {medicine.name}
                    </h3>
                    <div 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: highContrast ? '#000000' : '#dcfce7',
                        color: highContrast ? '#ffffff' : '#166534',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: `${fontSizeMultiplier * 14}px`,
                        fontWeight: '600'
                      }}
                    >
                      Confidence: {medicine.confidence ? (medicine.confidence * 100).toFixed(0) : '0'}%
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 
                      className="font-semibold mb-2"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 18}px`,
                        color: highContrast ? '#000000' : '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      🎯 Uses
                    </h4>
                    <p 
                      className="text-gray-700"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 16}px`,
                        color: highContrast ? '#000000' : '#374151'
                      }}
                    >
                      {medicine.uses || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h4 
                      className="font-semibold mb-2"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 18}px`,
                        color: highContrast ? '#000000' : '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      💉 Dosage
                    </h4>
                    <p 
                      className="text-gray-700"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 16}px`,
                        color: highContrast ? '#000000' : '#374151'
                      }}
                    >
                      {medicine.dosage || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h4 
                      className="font-semibold mb-2"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 18}px`,
                        color: highContrast ? '#000000' : '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      ⚠️ Side Effects
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {medicine.sideEffects && Array.isArray(medicine.sideEffects) && medicine.sideEffects.length > 0 ? (
                        medicine.sideEffects.map((effect, index) => (
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

                  <div>
                    <h4 
                      className="font-semibold mb-2"
                      style={{ 
                        fontSize: `${fontSizeMultiplier * 18}px`,
                        color: highContrast ? '#000000' : '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      🛡️ Precautions
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {medicine.precautions && Array.isArray(medicine.precautions) && medicine.precautions.length > 0 ? (
                        medicine.precautions.map((precaution, index) => (
                          <li 
                            key={index}
                            style={{ 
                              fontSize: `${fontSizeMultiplier * 16}px`,
                              color: highContrast ? '#000000' : '#6b7280'
                            }}
                          >
                            {precaution}
                          </li>
                        ))
                      ) : (
                        <li 
                          style={{ 
                            fontSize: `${fontSizeMultiplier * 16}px`,
                            color: highContrast ? '#000000' : '#6b7280'
                          }}
                        >
                          None
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <Button 
                    variant="secondary" 
                    onClick={() => handleListen(medicine)}
                    style={{
                      fontSize: `${fontSizeMultiplier * 14}px`,
                      padding: '8px 16px',
                      flex: '1'
                    }}
                  >
                    🔊 Listen
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => handleSetReminder(medicine)}
                    style={{
                      fontSize: `${fontSizeMultiplier * 14}px`,
                      padding: '8px 16px',
                      flex: '1'
                    }}
                  >
                    ⏰ Set Reminder
                  </Button>
                </div>
              </Card>
            );
            })}
          </div>

          {/* Add Medicine Button */}
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
                ➕ Add New Medicine
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Empty State - When no medicines but no error/loading */}
      {!loading && !error && (!medicines || medicines.length === 0) && (
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
            No Medicines Found
          </h3>
          <p 
            className="mt-2 text-gray-500"
            style={{ 
              fontSize: `${fontSizeMultiplier * 18}px`,
              color: highContrast ? '#000000' : '#6b7280',
              marginBottom: '24px'
            }}
          >
            Get started by adding your first medicine
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

      {/* Reminder Modal */}
      {showReminderModal && selectedMedicine && selectedMedicine.id && selectedMedicine.name && (
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
          >
            <h3 
              className="text-xl font-bold mb-4"
              style={{ 
                fontSize: `${fontSizeMultiplier * 24}px`,
                color: highContrast ? '#000000' : '#1f2937',
                marginBottom: '16px'
              }}
            >
              Set Reminder for {selectedMedicine.name}
            </h3>
            <p 
              className="mb-6"
              style={{ 
                fontSize: `${fontSizeMultiplier * 16}px`,
                color: highContrast ? '#000000' : '#6b7280'
              }}
            >
              Reminder functionality would be implemented here with time selection and dosage options.
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={closeReminderModal}
                style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={closeReminderModal}
                style={{ fontSize: `${fontSizeMultiplier * 16}px` }}
              >
                Set Reminder
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

export default MedicineListPage;