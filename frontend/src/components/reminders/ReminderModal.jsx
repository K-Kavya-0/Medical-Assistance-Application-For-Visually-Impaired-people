import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';

const ReminderModal = ({ 
  isOpen, 
  onClose, 
  medicineName, 
  onSave 
}) => {
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const { fontSizeMultiplier, highContrast } = useAccessibilitySettings();

  // Pre-fill medicine name when modal opens
  useEffect(() => {
    if (isOpen && medicineName) {
      // Set default time to current time + 1 hour
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const defaultTime = now.toTimeString().slice(0, 5);
      setTime(defaultTime);
    }
  }, [isOpen, medicineName]);

  const handleSave = () => {
    if (dosage && time) {
      const reminderData = {
        medicineName,
        dosage,
        time,
        frequency
      };
      onSave(reminderData);
      onClose();
    }
  };

  const handleCancel = () => {
    setDosage('');
    setTime('');
    setFrequency('daily');
    onClose();
  };

  if (!isOpen) return null;

  return (
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
        aria-labelledby="reminder-modal-title"
      >
        <h2 
          id="reminder-modal-title"
          className="text-xl font-bold mb-4"
          style={{ 
            fontSize: `${fontSizeMultiplier * 24}px`,
            color: highContrast ? '#000000' : '#1f2937',
            marginBottom: '16px'
          }}
        >
          ⏰ Set Medicine Reminder
        </h2>

        <div className="space-y-4">
          {/* Medicine Name (Pre-filled) */}
          <div>
            <label 
              htmlFor="medicine-name"
              className="block text-sm font-medium mb-2"
              style={{ 
                fontSize: `${fontSizeMultiplier * 16}px`,
                color: highContrast ? '#000000' : '#374151',
                marginBottom: '8px',
                fontWeight: '600'
              }}
            >
              💊 Medicine Name
            </label>
            <div 
              id="medicine-name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              style={{
                fontSize: `${fontSizeMultiplier * 16}px`,
                color: highContrast ? '#000000' : '#6b7280',
                padding: '12px',
                border: highContrast ? '2px solid #000000' : '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: highContrast ? '#f3f4f6' : '#f9fafb'
              }}
            >
              {medicineName}
            </div>
          </div>

          {/* Dosage */}
          <div>
            <label 
              htmlFor="dosage"
              className="block text-sm font-medium mb-2"
              style={{ 
                fontSize: `${fontSizeMultiplier * 16}px`,
                color: highContrast ? '#000000' : '#374151',
                marginBottom: '8px',
                fontWeight: '600'
              }}
            >
              💉 Dosage
            </label>
            <input
              id="dosage"
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 1 tablet, 2 capsules"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                fontSize: `${fontSizeMultiplier * 16}px`,
                padding: '12px',
                border: highContrast ? '2px solid #000000' : '1px solid #d1d5db',
                borderRadius: '6px',
                width: '100%',
                backgroundColor: 'white'
              }}
              aria-required="true"
            />
          </div>

          {/* Time */}
          <div>
            <label 
              htmlFor="reminder-time"
              className="block text-sm font-medium mb-2"
              style={{ 
                fontSize: `${fontSizeMultiplier * 16}px`,
                color: highContrast ? '#000000' : '#374151',
                marginBottom: '8px',
                fontWeight: '600'
              }}
            >
              🕐 Time
            </label>
            <input
              id="reminder-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                fontSize: `${fontSizeMultiplier * 16}px`,
                padding: '12px',
                border: highContrast ? '2px solid #000000' : '1px solid #d1d5db',
                borderRadius: '6px',
                width: '100%',
                backgroundColor: 'white'
              }}
              aria-required="true"
            />
          </div>

          {/* Frequency */}
          <div>
            <label 
              htmlFor="frequency"
              className="block text-sm font-medium mb-2"
              style={{ 
                fontSize: `${fontSizeMultiplier * 16}px`,
                color: highContrast ? '#000000' : '#374151',
                marginBottom: '8px',
                fontWeight: '600'
              }}
            >
              🔄 Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                fontSize: `${fontSizeMultiplier * 16}px`,
                padding: '12px',
                border: highContrast ? '2px solid #000000' : '1px solid #d1d5db',
                borderRadius: '6px',
                width: '100%',
                backgroundColor: 'white'
              }}
            >
              <option value="daily">Daily</option>
              <option value="twice_daily">Twice Daily</option>
              <option value="three_times_daily">Three Times Daily</option>
              <option value="weekly">Weekly</option>
              <option value="as_needed">As Needed</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            style={{ 
              fontSize: `${fontSizeMultiplier * 16}px`,
              padding: '10px 20px'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!dosage || !time}
            style={{ 
              fontSize: `${fontSizeMultiplier * 16}px`,
              padding: '10px 20px',
              opacity: (!dosage || !time) ? 0.5 : 1,
              cursor: (!dosage || !time) ? 'not-allowed' : 'pointer'
            }}
          >
            Save Reminder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;