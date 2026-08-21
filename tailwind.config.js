/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#820AD1',
          50: '#F2E4FF',
          100: '#E4C8FF',
          200: '#C792FF',
          300: '#AA5CFF',
          400: '#8E26F0',
          500: '#820AD1',
          600: '#5F0798',
          700: '#3E0560',
          800: '#1F022F',
          900: '#0E0017',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F9F9F9',
          'subtle-on-subtle': '#F4F4F4',
          pressed: '#E5E5E5',
        },
        content: {
          DEFAULT: '#000000',
          subtle: 'rgba(0, 0, 0, 0.64)',
          disabled: 'rgba(0, 0, 0, 0.32)',
          'on-color': '#FFFFFF',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          subtle: 'rgba(0, 0, 0, 0.04)',
          'accent-selected-disabled': 'rgba(130, 10, 209, 0.32)',
        },
      },
      spacing: {
        'menu-width': '180px',
      },
      borderRadius: {
        small: '4px',
        medium: '8px',
        large: '12px',
        'x-large': '16px',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        medium: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'subtitle-small': ['14px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-small': ['14px', { lineHeight: '1.5' }],
        'body-medium': ['16px', { lineHeight: '1.5' }],
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
