import { forwardRef } from 'react';

const input = forwardRef(({ 
  className = '', 
  variant = 'default',
  error = false,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
    error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-500 focus:ring-green-500 focus:border-green-500'
  };

  const variantClass = error ? variants.error : variants[variant];

  return (
    <input
      ref={ref}
      className={`${baseClasses} ${variantClass} ${className}`}
      {...props}
    />
  );
});

input.displayName = 'input';

export default input;