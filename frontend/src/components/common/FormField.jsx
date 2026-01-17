import React from 'react';
import { Label } from './Label';
import { useAccessibilitySettings } from '../../contexts/AccessibilitySettingsContext';

const FormField = ({ 
  label, 
  id, 
  children, 
  error, 
  description, 
  required, 
  helpText,
  ariaLabel,
  ...props 
}) => {
  const { settings } = useAccessibilitySettings();

  const fieldStyle = {
    marginBottom: settings.fontSize === 'large' ? '24px' : settings.fontSize === 'extraLarge' ? '28px' : '16px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: settings.fontSize === 'large' ? '18px' : settings.fontSize === 'extraLarge' ? '20px' : '14px',
    fontWeight: 500,
    marginBottom: '8px',
    color: settings.highContrast ? '#000000' : '#374151',
  };

  const errorStyle = {
    fontSize: settings.fontSize === 'large' ? '16px' : settings.fontSize === 'extraLarge' ? '18px' : '14px',
    color: settings.highContrast ? '#ff0000' : '#dc2626',
    marginTop: '6px',
    fontWeight: 'bold',
    padding: '8px',
    backgroundColor: settings.highContrast ? '#ffff00' : '#fee2e2',
    borderRadius: '4px'
  };

  const descriptionStyle = {
    fontSize: settings.fontSize === 'large' ? '16px' : settings.fontSize === 'extraLarge' ? '18px' : '14px',
    color: settings.highContrast ? '#333333' : '#6b7280',
    marginTop: '6px',
    fontStyle: 'italic'
  };

  const describedByIds = [
    error && `${id}-error`,
    description && `${id}-description`,
    helpText && `${id}-help`
  ].filter(Boolean).join(' ');

  return (
    <div style={fieldStyle} {...props}>
      {label && (
        <Label 
          htmlFor={id} 
          style={labelStyle}
          role="label"
          aria-required={required}
        >
          {label} 
          {required && (
            <span 
              aria-label="required" 
              style={{ color: settings.highContrast ? '#ff0000' : '#ef4444', marginLeft: '4px' }}>
              *
            </span>
          )}
        </Label>
      )}
      
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            'aria-describedby': describedByIds || undefined,
            'aria-required': required || undefined,
            'aria-label': ariaLabel || label || undefined,
            'aria-invalid': !!error,
            style: {
              ...child.props.style,
              fontSize: settings.fontSize === 'large' ? '16px' : settings.fontSize === 'extraLarge' ? '18px' : '14px',
              padding: settings.largeButtons ? '12px' : '8px'
            }
          });
        }
        return child;
      })}

      {error && (
        <div
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          style={errorStyle}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {description && !error && (
        <p 
          id={`${id}-description`}
          style={descriptionStyle}
          role="doc-tip"
        >
          {description}
        </p>
      )}

      {helpText && (
        <p 
          id={`${id}-help`}
          style={{...descriptionStyle, marginTop: error ? '0' : '6px'}}
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormField;