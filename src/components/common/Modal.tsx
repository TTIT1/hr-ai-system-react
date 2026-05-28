import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, title, onClose, children, size = 'lg' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      window.setTimeout(() => modalRef.current?.focus(), 0);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#1b1b22]/45 backdrop-blur-sm dark:bg-[#050711]/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              onKeyDown={(event) => event.key === 'Escape' && onClose()}
              className={`relative max-h-[90vh] w-full ${sizeMap[size]} overflow-auto rounded-2xl border border-[#c8c4d5] bg-white shadow-xl shadow-[#1f108e]/10 outline-none dark:border-[#2e2a3d] dark:bg-[#13111f] dark:shadow-panel`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Top gradient accent */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1f108e]/45 to-transparent dark:via-[#7c6ff5]/55" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#e4e1eb] px-6 py-4 dark:border-[#2e2a3d]">
                <h2 className="text-base font-semibold text-[#1b1b22] dark:text-[#e8e4f0]">{title}</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 px-0"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Body */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
