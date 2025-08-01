import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'gray';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  color = 'gray',
  className = '' 
}) => {
  // Color classes
  const colorClasses = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
