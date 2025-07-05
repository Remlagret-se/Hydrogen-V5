# TailwindPlus Integration Guide

## 1. Dependencies Setup

First, let's update our package.json with the required dependencies:

```json
{
  "dependencies": {
    "@headlessui/react": "^2.2.4",
    "@heroicons/react": "^2.2.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "@tailwindcss/forms": "^0.5.10"
  }
}
```

## 2. Font Configuration

Add the Inter font family to our project:

```html
<!-- app/root.tsx -->
<head>
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
</head>
```

Update Tailwind configuration:

```javascript
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
        display: ['InterVariable', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        // Brand Colors
        'brand': {
          50: '#E6FFF7',
          100: '#B3FFE6',
          200: '#80FFD6',
          300: '#4DFFC5',
          400: '#1AFFB4',
          500: '#00E69D',
          600: '#00B37A',
          700: '#008056',
          800: '#004D33',
          900: '#001A11',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
};
```

## 3. Component Structure

Following TailwindPlus best practices, organize components into categories:

```
app/
  components/
    marketing/
      Hero.tsx
      Features.tsx
      Pricing.tsx
      Newsletter.tsx
      Testimonials.tsx
      Team.tsx
      LogoCloud.tsx
      FAQ.tsx
    
    ecommerce/
      ProductOverview.tsx
      ProductList.tsx
      CategoryPreview.tsx
      ShoppingCart.tsx
      CategoryFilters.tsx
      ProductQuickview.tsx
      StoreNavigation.tsx
      CheckoutForm.tsx
      Reviews.tsx
      OrderSummary.tsx
      
    application/
      Table.tsx
      Form.tsx
      SelectMenu.tsx
      RadioGroup.tsx
      Checkbox.tsx
      Combobox.tsx
      Navbar.tsx
      Pagination.tsx
      Sidebar.tsx
      CommandPalette.tsx
      Modal.tsx
      Dropdown.tsx
```

## 4. Utility Components

Create base utility components following TailwindPlus patterns:

```tsx
// app/components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200';
  
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
    secondary: 'bg-brand-100 text-brand-700 hover:bg-brand-200 focus:ring-brand-500',
    white: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-brand-500',
  };
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${loading ? 'relative !text-transparent' : ''}
      `}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
}
```

## 5. Animation Configuration

Set up recommended TailwindPlus animations:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 200ms ease-in',
        'slide-in': 'slide-in 200ms ease-out',
        'slide-out': 'slide-out 200ms ease-in',
      },
    },
  },
};
```

## 6. Accessibility Setup

Implement TailwindPlus accessibility patterns:

```tsx
// app/components/ui/VisuallyHidden.tsx
export function VisuallyHidden({children}: {children: React.ReactNode}) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// app/components/ui/FocusRing.tsx
export function FocusRing({children}: {children: React.ReactNode}) {
  return (
    <div className="focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
      {children}
    </div>
  );
}
```

## 7. Responsive Design Patterns

Follow TailwindPlus responsive design best practices:

```tsx
// app/components/ui/Container.tsx
export function Container({
  size = 'md',
  children,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
}) {
  const sizes = {
    sm: 'max-w-4xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-8xl',
  };
  
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]}`}>
      {children}
    </div>
  );
}
```

## 8. Icon Integration

Set up Heroicons as recommended by TailwindPlus:

```tsx
// app/components/ui/Icon.tsx
import * as HIcons from '@heroicons/react/24/outline';
import * as HSolid from '@heroicons/react/24/solid';

type IconName = keyof typeof HIcons;

export function Icon({
  name,
  solid = false,
  className = 'w-6 h-6',
}: {
  name: IconName;
  solid?: boolean;
  className?: string;
}) {
  const icons = solid ? HSolid : HIcons;
  const IconComponent = icons[name];
  
  return <IconComponent className={className} aria-hidden="true" />;
}
```

## 9. Form Components

Implement TailwindPlus form patterns:

```tsx
// app/components/ui/Input.tsx
export function Input({
  type = 'text',
  label,
  error,
  ...props
}: {
  type?: string;
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-brand-500 focus:ring-brand-500 sm:text-sm
          ${error ? 'border-red-300' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
```

## 10. Dark Mode Support

Configure dark mode as recommended by TailwindPlus:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
};
```

[Source: Tailwind UI Documentation](https://tailwindcss.com/plus/ui-blocks/documentation#illustrations)

Would you like me to:
1. Add more component examples?
2. Create additional utility patterns?
3. Add more accessibility features?
4. Provide dark mode component examples? 