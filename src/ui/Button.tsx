import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  darkMode?: boolean;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  darkMode = false
}: ButtonProps) {

  if (className) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    );
  }

  const baseClasses = `
    font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `.trim();

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: darkMode 
      ? 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400'
      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: darkMode
      ? 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-400'
      : 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
    success: darkMode
      ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400'
      : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: darkMode
      ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
      : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: darkMode
      ? 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400'
      : 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    purple: darkMode
      ? 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-400'
      : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500'
  };

  const combinedClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}