import React, {createContext, useContext, useCallback, useRef, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';

interface AsideContextType {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const AsideContext = createContext<AsideContextType | null>(null);

export function AsideProvider({children}: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const asideRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const open = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  // Close aside on navigation
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close aside on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  // Close aside on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  return (
    <AsideContext.Provider value={{open, close, isOpen}}>
      {children}
      {isOpen && (
        <div
          ref={asideRef}
          className="fixed inset-0 z-50 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out"
          role="dialog"
          aria-modal="true"
        >
          {/* Aside content will be rendered here */}
        </div>
      )}
    </AsideContext.Provider>
  );
}

export function useAside() {
  const context = useContext(AsideContext);
  if (!context) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return context;
}

interface AsideProps {
  type: string;
  heading: string;
  children: React.ReactNode;
}

// Export Aside as a namespace with Provider
export const Aside = {
  Provider: AsideProvider,
};

// Default Aside component
export function AsideComponent({type, heading, children}: AsideProps) {
  const {close, isOpen} = useAside();

  if (!isOpen) return null;

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">{heading}</h2>
        <button
          onClick={close}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
} 
