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
          950: '#050E17',
          900: '#071521',
          850: '#091B2A',
          800: '#0D2234',
          750: '#102838',
          700: '#122D3E',
          600: '#1B3D54',
          500: '#25506E',
        },
        bg: {
          base: '#050E17',
          surface: '#091B2A',
          card: '#102838',
          elevated: '#143245',
        },
        border: {
          subtle: '#1C374A',
          DEFAULT: '#29485A',
          card: '#29485A',
          highlight: '#3B647D',
        },
        lab: {
          cyan: '#54D7E8',
          lime: '#D8F36A',
          coral: '#FF875F',
          red: '#F06B70',
          text: '#F4F7FA',
          muted: '#A8BBC8',
          faint: '#6E8A9E',
        },
        'air-cyan': '#54D7E8',
        'acid-lime': '#D8F36A',
        'coral-orange': '#FF875F',
        'soft-red': '#F06B70',
        text: {
          primary: '#F4F7FA',
          secondary: '#DCE6F0',
          muted: '#A8BBC8',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      aspectRatio: {
        '16/9': '16 / 9',
      }
    },
  },
  plugins: [],
}
