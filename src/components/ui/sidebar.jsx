import { useEffect, useRef } from 'react';

export default function sidebar({ 
  isOpen, 
  onClose, 
  title = 'Panel', 
  children, 
  side = 'right', 
  widthClass = 'max-w-md' 
}) {
  const containerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown);
      // Focus trap entry point
      setTimeout(() => {
        const focusable = panelRef.current?.querySelector('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
        focusable?.focus();
      }, 0);
    }
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  function onBackdrop(e) {
    if (e.target === containerRef.current) onClose?.();
  }

  return (
    <div
      ref={containerRef}
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onMouseDown={onBackdrop}
    >
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute top-0 bottom-0 ${side === 'right' ? 'right-0' : 'left-0'} bg-white shadow-xl w-full ${widthClass}
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="px-2 py-1 rounded hover:bg-neutral-100" aria-label="Close sidebar">✕</button>
        </div>
        <div className="overflow-y-auto h-full p-4">{children}</div>
      </aside>
    </div>
  );
}