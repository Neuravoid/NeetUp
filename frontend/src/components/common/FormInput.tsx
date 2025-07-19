import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  helper?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  error,
  helper,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`form-input ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helper}</p>
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default FormInput;
