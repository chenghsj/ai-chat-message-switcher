module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  variants: {
    extend: {
      backgroundImage: ['checked'],
    },
  },
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  prefix: '',
  plugins: [],
  mode: 'jit',
};
