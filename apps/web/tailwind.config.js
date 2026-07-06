/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  // Layout-critical classes are safelisted so the app shell always offsets the
  // sidebar correctly regardless of JIT content scanning.
  safelist: [
    'lg:sticky', 'lg:top-0', 'lg:h-screen', 'lg:z-auto', 'lg:translate-x-0',
    'lg:w-60', 'lg:w-[68px]', 'w-60', 'lg:justify-center', 'lg:px-0', 'lg:block',
    'lg:hidden', 'lg:flex-col', 'lg:gap-2', '-translate-x-full', 'translate-x-0',
    'flex-1', 'min-w-0',
    // Status badge tokens (see src/lib/ui/status.ts) — used via dynamic lookup.
    'bg-brand-50', 'text-brand-700', 'border-brand-200',
    'bg-emerald-50', 'text-emerald-700', 'border-emerald-200',
    'bg-slate-100', 'text-slate-600', 'border-slate-200',
    'bg-red-50', 'text-red-700', 'border-red-200',
    'bg-amber-50', 'text-amber-700', 'border-amber-200',
    // Navy sidebar/app-shell tokens
    'bg-navy', 'bg-navy-800', 'bg-navy-950', 'from-navy-950', 'via-navy', 'to-navy-800',
    'bg-gradient-to-br', 'border-white/10', 'border-white/25', 'bg-white/10', 'bg-white/5',
    'text-brand-400', 'text-slate-400',
    'hover:bg-white/10', 'hover:bg-white/5', 'hover:text-white', 'hover:text-red-300',
    'text-slate-200', 'text-slate-300', 'text-brand-300', 'group-hover:text-slate-200',
    'border-l-4', 'border-l-red-500', 'border-l-amber-500', 'border-l-brand-500', 'opacity-70',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      colors: {
        // Deep espresso — the dark anchor of the brown/white theme.
        navy: {
          DEFAULT: '#2B1D10',
          800: '#3A2817',
          900: '#2B1D10',
          950: '#1D130A',
        },
        // shadcn/ui semantic tokens (driven by CSS variables in globals.css).
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand: a clean, trustworthy medical blue (matches the medicom design).
        brand: {
          DEFAULT: '#8A5A2E',
          50: '#FAF6F0',
          100: '#F2E8DA',
          200: '#E4D0B4',
          300: '#D2B189',
          400: '#BC8F5F',
          500: '#A2733F',
          600: '#8A5A2E',
          700: '#714824',
          800: '#5B3A1E',
          900: '#4A3019',
          950: '#2E1D0E',
        },
        slate: { 950: '#020617' },
        cyan: { 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2' },
        // Apple-style soft neutrals: calm off-whites + near-black ink.
        canvas: '#fbfbfd',
        mist: '#f5f5f7',
        ink: { DEFAULT: '#1d1d1f', soft: '#6e6e73' },
      },
      borderRadius: {
        // shadcn tokens driven by --radius
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 4px 16px -2px rgb(15 23 42 / 0.06)',
        'card-hover': '0 12px 32px -8px rgb(79 70 229 / 0.18)',
        'brand-glow': '0 10px 40px -10px rgb(79 70 229 / 0.5)',
        soft: '0 2px 8px -2px rgb(15 23 42 / 0.06), 0 12px 40px -12px rgb(15 23 42 / 0.10)',
      },
      letterSpacing: {
        tighter: '-0.03em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-slate':
          'linear-gradient(to right, rgb(15 23 42 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 23 42 / 0.04) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
