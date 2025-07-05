export function getInputStyleClasses(error?: string | null) {
  return `w-full rounded border px-3 py-2 text-primary/90 transition-shadow duration-150 
    ${
      error
        ? 'border-red-500'
        : 'border-primary/20 hover:border-primary/40 focus:border-primary/40'
    }
    focus:outline-none focus:ring-0 disabled:border-primary/10 disabled:bg-primary/5 disabled:opacity-70
  `;
} 