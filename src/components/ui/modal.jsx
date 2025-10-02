import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown);
      // Focus trap
      setTimeout(() => {
        const focusable = modalRef.current?.querySelector('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
        focusable?.focus();
      }, 0);
    }
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  function onBackdrop(e) {
    if (e.target === modalRef.current) onClose?.();
  }

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onMouseDown={onBackdrop}
    >
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{title}</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}