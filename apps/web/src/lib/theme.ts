/**
 * MEDICONNECT UNIFIED THEME
 * Single, consistent light + indigo system shared across the whole app.
 * (Role colors are intentionally unified to the brand for visual consistency.)
 */

const brandRole = {
  primary: "#4f46e5", // brand-600
  secondary: "#6366f1", // brand-500
  gradient: "from-brand-600 to-brand-500",
  hover: "hover:from-brand-700 hover:to-brand-600",
  light: "#a5b4fc", // brand-300
  dark: "#4338ca", // brand-700
  bg: "bg-brand-600",
};

export const theme = {
  roles: {
    patient: brandRole,
    doctor: brandRole,
    nurse: brandRole,
    midwife: brandRole,
    lawyer: brandRole,
  },

  colors: {
    background: {
      primary: "bg-canvas",
      secondary: "bg-white",
      tertiary: "bg-mist",
      gradient: "bg-canvas",
    },
    text: {
      primary: "text-ink",
      secondary: "text-slate-600",
      tertiary: "text-slate-500",
      muted: "text-slate-400",
    },
    border: {
      primary: "border-slate-200",
      secondary: "border-slate-200",
      focus: "border-brand-500",
    },
    success: { primary: "#059669", bg: "#ecfdf5", light: "#6ee7b7" },
    error: { primary: "#dc2626", bg: "#fef2f2", light: "#fca5a5" },
    warning: { primary: "#d97706", bg: "#fffbeb", light: "#fcd34d" },
    info: { primary: "#4f46e5", bg: "#eef2ff", light: "#a5b4fc" },
  },

  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4rem",
  },

  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  typography: {
    heading: {
      h1: "text-4xl md:text-5xl font-semibold tracking-tight text-ink",
      h2: "text-3xl md:text-4xl font-semibold tracking-tight text-ink",
      h3: "text-2xl md:text-3xl font-semibold text-ink",
      h4: "text-xl md:text-2xl font-semibold text-ink",
      h5: "text-lg md:text-xl font-medium text-ink",
      h6: "text-base md:text-lg font-medium text-ink",
    },
    body: {
      large: "text-lg text-slate-600",
      base: "text-base text-slate-600",
      small: "text-sm text-slate-600",
      tiny: "text-xs text-slate-500",
    },
  },

  components: {
    card: {
      base: "bg-white rounded-2xl border border-slate-200 p-6 shadow-card",
      hover: "hover:shadow-card-hover transition-all",
      elevated: "shadow-soft",
    },
    button: {
      base: "px-4 py-2 rounded-xl font-semibold transition-all",
      primary: "bg-brand-600 text-white hover:bg-brand-700",
      secondary: "bg-mist hover:bg-slate-200 text-ink",
      outline: "border border-slate-300 bg-transparent hover:bg-mist text-ink",
      disabled: "opacity-50 cursor-not-allowed",
      sizes: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
      },
    },
    input: {
      base: "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-ink placeholder-slate-400 focus:outline-none transition-colors",
      focus: "focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15",
      error: "border-red-400 focus:border-red-500 focus:ring-red-500/15",
      success: "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/15",
    },
    badge: {
      base: "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
      success: "bg-emerald-50 text-emerald-700",
      error: "bg-red-50 text-red-700",
      warning: "bg-amber-50 text-amber-700",
      info: "bg-brand-50 text-brand-700",
      pending: "bg-amber-50 text-amber-700",
      verified: "bg-emerald-50 text-emerald-700",
    },
    alert: {
      base: "p-4 rounded-xl border",
      success: "bg-emerald-50 border-emerald-200 text-emerald-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-amber-50 border-amber-200 text-amber-800",
      info: "bg-brand-50 border-brand-200 text-brand-800",
    },
  },

  animations: {
    transition: {
      fast: "transition-all duration-150",
      normal: "transition-all duration-300",
      slow: "transition-all duration-500",
    },
    hover: {
      scale: "hover:scale-105",
      scaleSmall: "hover:scale-102",
      lift: "hover:-translate-y-1",
      glow: "hover:shadow-card-hover",
    },
  },

  layouts: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-12 md:py-16 lg:py-20",
    page: "min-h-screen bg-canvas",
  },
};

export function getRoleTheme(role: keyof typeof theme.roles) {
  return theme.roles[role];
}

export function getRoleGradient(role: keyof typeof theme.roles) {
  return `bg-gradient-to-r ${theme.roles[role].gradient}`;
}

export function getRoleHoverGradient(role: keyof typeof theme.roles) {
  return `bg-gradient-to-r ${theme.roles[role].gradient} ${theme.roles[role].hover}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
