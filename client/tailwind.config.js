/** @type {import('tailwindcss').Config} */
export default {
  content: [    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  base:{
    './':'./',
  },
  build:{
    outDir: 'dist',
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

