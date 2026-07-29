/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Azure-inspired brand palette
        azure: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#0078D4',
          700: '#106EBE',
          800: '#1E3A5F',
          900: '#0D1B2E',
        },
        trust: {
          green:  '#00B294',
          teal:   '#00BCF2',
          purple: '#5C2D91',
          yellow: '#F59E0B',
          red:    '#EF4444',
        },
        surface: {
          DEFAULT: '#0F172A',
          panel:   '#1E293B',
          card:    '#243447',
          border:  '#334155',
          muted:   '#475569',
        },
        text: {
          primary:  '#F1F5F9',
          secondary:'#CBD5E1',
          muted:    '#94A3B8',
          disabled: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      animation: {
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':      'spin 3s linear infinite',
        'glow-pulse':     'glow-pulse 2s ease-in-out infinite',
        'trust-reveal':   'trust-reveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up':       'slide-up 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'fade-in':        'fade-in 0.3s ease-out forwards',
        'scan-line':      'scan-line 2s ease-in-out infinite',
        'border-glow':    'border-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(0,120,212,0.4)' },
          '50%':       { boxShadow: '0 0 24px 8px rgba(0,120,212,0.7)' },
        },
        'trust-reveal': {
          '0%':   { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'slide-in-right': {
          '0%':   { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scan-line': {
          '0%, 100%': { transform: 'translateY(-100%)', opacity: '0.6' },
          '50%':       { transform: 'translateY(100%)',  opacity: '0.3' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(0,120,212,0.4)' },
          '50%':       { borderColor: 'rgba(0,188,242,0.8)' },
        },
      },
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':      'radial-gradient(at 40% 20%, hsla(228,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0px, transparent 50%)',
        'azure-gradient':     'linear-gradient(135deg, #0078D4 0%, #106EBE 50%, #00BCF2 100%)',
        'trust-gradient':     'linear-gradient(135deg, #00B294 0%, #0078D4 100%)',
        'danger-gradient':    'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)',
        'surface-gradient':   'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
        'hero-gradient':      'radial-gradient(ellipse at 50% 0%, rgba(0,120,212,0.2) 0%, transparent 60%)',
      },
      boxShadow: {
        'azure-glow':   '0 0 20px rgba(0,120,212,0.4)',
        'trust-glow':   '0 0 20px rgba(0,178,148,0.4)',
        'danger-glow':  '0 0 20px rgba(239,68,68,0.4)',
        'panel':        '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':   '0 8px 32px rgba(0,0,0,0.5)',
        'inner-azure':  'inset 0 0 20px rgba(0,120,212,0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
