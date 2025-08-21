/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  jit: true,
  theme: {
    extend: {},
    screens: {
      xs: '440px',
      'sm-md': '830px',
      ...defaultTheme.screens,
    },
    zIndex: {
      0: 0,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      25: 25,
      50: 50,
      75: 75,
      100: 100,
      500: 500,
      auto: 'auto',
    },
  },
  plugins: [],
};
