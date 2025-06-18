import React from 'react';

interface SelectFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  className?: string;
  darkMode?: boolean;
}

export default function SelectField({
  id,
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className = '',
  darkMode = false
}: SelectFieldProps) {
  const selectClasses = `
    w-full px-3 py-2 border rounded-md transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${darkMode 
      ? 'bg-gray-800 border-gray-600 text-gray-100 focus:ring-blue-400' 
      : 'bg-white border-gray-300 text-gray-900'
    }
    ${className}
  `.trim();

  const labelClasses = `
    block text-sm font-medium mb-2
    ${darkMode ? 'text-gray-200' : 'text-gray-700'}
  `.trim();

  return (
    <div className="mb-4">
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={selectClasses}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}