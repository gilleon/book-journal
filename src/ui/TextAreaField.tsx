import React from 'react';

interface TextAreaFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
  darkMode?: boolean;
}

export default function TextAreaField({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  className = '',
  darkMode = false
}: TextAreaFieldProps) {
  const textAreaClasses = `
    w-full px-3 py-2 border rounded-md transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    resize-vertical
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

  return (
    <div className="mb-4">
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        rows={rows}
        className={textAreaClasses}
      />
    </div>
  );
}