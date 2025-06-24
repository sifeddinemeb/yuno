/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: { 
          100: '#121212',
          200: '#1e1e1e',
          300: '#282828',
          400: '#3d3d3d',
          500: '#505050',
          600: '#646464',
          700: '#7e7e7e',
          800: '#9e9e9e',
          900: '#b8b8b8',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#8b5cf6',
          pink: '#f472b6',
          green: '#10b981',
          orange: '#f97316',
          red: '#ef4444',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
        gray: {
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
        gray: {
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
      backgroundImage: {
        'grain': "url('data:image/svg+xml,%3Csvg width=\"200\" height=\"200\" viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.4\"/%3E%3C/svg%3E')",
      },
      fontFamily: {
        sans: [
          'Inter var', 
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
      },
    },
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        'html': { 
          fontSize: '16px', 
          overflowX: 'hidden' 
        },
        'body': {
          maxWidth: '100vw',
          overflowX: 'hidden'
        },
        'table': {
          borderCollapse: 'separate',
          borderSpacing: 0,
          width: '100%'
        }
      });
    },
    function({ addBase }) {
      addBase({
        'html': { 
          fontSize: '16px', 
          overflowX: 'hidden' 
        },
        'body': {
          maxWidth: '100vw',
          overflowX: 'hidden'
        },
        'table': {
          borderCollapse: 'separate',
          borderSpacing: 0,
          width: '100%'
        }
      });
    }
  ]
};