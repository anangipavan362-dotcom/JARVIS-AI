/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jarvis: {
          bg: "#030712",
          dark: "#050B14",
          card: "rgba(6, 18, 36, 0.7)",
          cyan: "#00E5FF",
          electric: "#008CFF",
          green: "#00FF66",
          alert: "#FF3030",
          warning: "#FF9900",
          text: "#E8FFFF",
          dim: "#7A92A6",
          border: "rgba(0, 229, 255, 0.25)",
          borderGlow: "rgba(0, 229, 255, 0.5)",
        }
      },
      fontFamily: {
        mono: ['Consolas', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        hud: ['Orbitron', 'Consolas', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'hud-cyan': '0 0 15px rgba(0, 229, 255, 0.3), inset 0 0 15px rgba(0, 229, 255, 0.1)',
        'hud-glow': '0 0 25px rgba(0, 229, 255, 0.5)',
        'hud-blue': '0 0 20px rgba(0, 140, 255, 0.4)',
        'hud-alert': '0 0 20px rgba(255, 48, 48, 0.5)',
        'hud-green': '0 0 20px rgba(0, 255, 102, 0.4)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin-reverse 25s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'radar': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
