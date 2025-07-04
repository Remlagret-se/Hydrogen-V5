'use client';

import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function AnimatedDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={() => setOpen(true)}
      >
        Visa dialog
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel as={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full"
          >
            <Dialog.Title className="text-lg font-bold mb-4">En snygg dialog</Dialog.Title>
            <p>Detta är en dialog med Framer Motion och Headless UI.</p>
            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
              onClick={() => setOpen(false)}
            >
              Stäng
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
} 
