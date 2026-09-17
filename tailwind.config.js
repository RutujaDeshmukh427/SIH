/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#F8FAFC",
        panel: {
          DEFAULT: "rgba(255, 255, 255, 0.92)",
          raised: "#FFFFFF",
          line: "rgba(226, 232, 240, 0.9)",
          darker: "#F1F5F9",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          ink: "#0F172A",
        },
        brass: {
          DEFAULT: "#1D4ED8", // Executive Sapphire Blue
          strong: "#1E40AF",
          ink: "#FFFFFF",
          glow: "rgba(29, 78, 216, 0.25)",
        },
        citizen: {
          primary: "#0284C7", // Trustworthy Civic Cerulean
          secondary: "#0369A1",
          glow: "rgba(2, 132, 199, 0.2)",
        },
        text: {
          1: "#0F172A", // Slate 900
          2: "#334155", // Slate 700
          3: "#64748B", // Slate 500
        },
        status: {
          pass: "#059669",
          'pass-bg': "rgba(5, 150, 105, 0.1)",
          fail: "#DC2626",
          'fail-bg': "rgba(220, 38, 38, 0.1)",
          review: "#D97706",
          'review-bg': "rgba(217, 119, 6, 0.1)",
        }
      },
      fontFamily: {
        brand: ["'Plus Jakarta Sans'", "'Montserrat'", "sans-serif"],
        serif: ["'Cinzel'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "'Montserrat'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'brass-glow': '0 4px 14px -1px rgba(29, 78, 216, 0.3)',
        'pass-glow': '0 4px 14px -1px rgba(5, 150, 105, 0.25)',
        'fail-glow': '0 4px 14px -1px rgba(220, 38, 38, 0.25)',
        'glass': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulseGlow': 'pulseGlow 3s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slideUp': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 5s ease-in-out infinite',
        'scanSweep': 'scanSweep 2.5s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(15px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(25px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanSweep: {
          '0%': { top: '-25%', opacity: '0.8' },
          '50%': { opacity: '1' },
          '100%': { top: '105%', opacity: '0.8' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
