import React from 'react';
import {useAside} from './Aside';

export function AsideContent({children}: {children: React.ReactNode}) {
  const {close, isOpen} = useAside();

  if (!isOpen) return null;

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex justify-end p-4">
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

export default AsideContent; 
