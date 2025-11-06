import { useEffect } from 'react';
import { cn } from '../../lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-slate-900 mx-4 sm:mx-6 md:mx-0',
        )}
      >
        {title && (
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
