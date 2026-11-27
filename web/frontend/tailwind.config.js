/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mono: {
          black: "#000000",
          deep: "#050505",
          graphite: "#111111",
          dark: "#1B1B1B",
          border: "#2A2A2A",
          muted: "#666666",
          silver: "#C8C8C8",
          light: "#E5E5E5",
          white: "#FFFFFF",
        },
        jarvis: {
          bg: "#050505",
          dark: "#000000",
          card: "rgba(17, 17, 17, 0.8)",
          cyan: "#FFFFFF", // Remapped for legacy compatibility to pure white
          electric: "#E5E5E5", // Remapped to light silver
          green: "#C8C8C8", // Remapped to silver
          alert: "#FFFFFF", // Remapped to white
          warning: "#E5E5E5", // Remapped to silver
          text: "#FFFFFF",
          dim: "#888888",
          border: "rgba(255, 255, 255, 0.15)",
          borderGlow: "rgba(255, 255, 255, 0.35)",
        }
      },
      fontFamily: {
        mono: ['Consolas', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        hud: ['Orbitron', 'Consolas', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'mono-glow': '0 0 25px rgba(255, 255, 255, 0.25)',
        'mono-subtle': '0 0 15px rgba(255, 255, 255, 0.12)',
        'mono-silver': '0 0 20px rgba(200, 200, 200, 0.2)',
        'mono-rim': 'inset 0 0 15px rgba(255, 255, 255, 0.08), 0 0 10px rgba(255, 255, 255, 0.15)',
        'hud-cyan': '0 0 20px rgba(255, 255, 255, 0.25)',
        'hud-glow': '0 0 30px rgba(255, 255, 255, 0.35)',
        'hud-blue': '0 0 20px rgba(200, 200, 200, 0.2)',
        'hud-alert': '0 0 20px rgba(255, 255, 255, 0.3)',
        'hud-green': '0 0 20px rgba(220, 220, 220, 0.25)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin-reverse 25s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'radar': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
