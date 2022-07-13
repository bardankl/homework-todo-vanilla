module.exports = {
  content: ['./*.{html,js}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        ram: 'repeat(auto-fit, minmax(0, 350px));',
      },

      animation: {
        'slide-from-top': 'slide-from-top 0.6s ease-in-out forwards',
      },

      keyframes: {
        'slide-from-top': {
          '100%': { transform: 'translateY(0px)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
