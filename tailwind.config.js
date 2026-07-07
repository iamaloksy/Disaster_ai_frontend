/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Core "command center" palette - dark slate base with
        // alert-amber and signal-red accents mirroring real emergency
        // operations dashboards.
        ink: {
          950: "#0A0E14",   // deepest background
          900: "#0F1620",   // page background
          800: "#16202C",   // card surface
          700: "#1E2A38",   // raised surface / hover
          600: "#2A3949",   // borders
          500: "#3D4F61",   // muted borders / dividers
        },
        mist: {
          400: "#6B7E91",   // muted text
          300: "#94A7B8",   // secondary text
          200: "#C2D1DD",   // body text on dark
          100: "#E8EFF4",   // headings on dark
        },
        signal: {
          DEFAULT: "#FF4757",  // critical red
          dim: "#B23A45",
          glow: "#FF6B78",
        },
        amber: {
          DEFAULT: "#FFA734",  // high/warning amber
          dim: "#C9842A",
        },
        sage: {
          DEFAULT: "#3DD68C",  // resolved/safe green
          dim: "#2A9D6B",
        },
        cobalt: {
          DEFAULT: "#4D8EFF",  // info / flood blue
          dim: "#3A6BC2",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        'signal-glow': '0 0 0 1px rgba(255,71,87,0.4), 0 0 24px rgba(255,71,87,0.15)',
        'card': '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
