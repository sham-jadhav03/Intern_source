/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d8eb',
          300: '#94bcdd',
          400: '#5e9bcc',
          500: '#387eb8',
          600: '#26649b',
          700: '#1b456e',
          800: '#163554',
          900: '#0f233a',
          950: '#091523',
        },
        brand: {
          primary: '#0f233a',     // Deep Navy
          dark: '#0a1726',
          secondary: '#1e3a5f',
          accent: '#f97316',      // Vibrant Orange
          accentHover: '#ea580c',
          accentLight: '#ffedd5',
          surface: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
