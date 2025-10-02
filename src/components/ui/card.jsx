import { forwardRef } from 'react';

const card = forwardRef(({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}, ref) => {
  const baseClasses = 'rounded-2xl shadow-lg border border-white/20';
  
  const variants = {
    default: 'bg-white/80 backdrop-blur-sm',
    solid: 'bg-white',
    glass: 'bg-white/60 backdrop-blur-md',
    gradient: 'bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm'
  };

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

card.displayName = 'card';

const cardHeader = forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
));

cardHeader.displayName = 'cardHeader';

const cardContent = forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
));

cardContent.displayName = 'cardContent';

const cardFooter = forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-4 ${className}`} {...props}>
    {children}
  </div>
));

cardFooter.displayName = 'cardFooter';

export { card as default, cardHeader, cardContent, cardFooter };
