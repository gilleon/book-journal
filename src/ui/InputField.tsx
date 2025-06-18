import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'radio';
  name: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  darkMode?: boolean;
  options?: Array<{ value: string; label: string }>;
  onRadioChange?: (value: string) => void;
}

export default function InputField({
  id,
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  darkMode = false,
  options,
  onRadioChange
}: InputFieldProps) {
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-md transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${darkMode 
      ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-blue-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }
    ${className}
  `.trim();

  const labelClasses = `
    block text-sm font-medium mb-2
    ${darkMode ? 'text-gray-200' : 'text-gray-700'}
  `.trim();

  // Handle radio button type
  if (type === 'radio' && options && onRadioChange) {
    return (
      <div className={`mb-4 ${className}`}>
        <p className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
        <div className="flex gap-4">
          {options.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onRadioChange(option.value)}
                className="mr-2 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Handle regular input types
  return (
    <div className="mb-4">
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        required={required}
        className={baseInputClasses}
      />
    </div>
  );
}