const colors = require('tailwindcss/colors')
const forms = require('@tailwindcss/forms');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        "blue-gray": colors.blue - gray,
        "cool-gray": colors.coolGray,
        // gray: colors.gray,
        "true-gray": colors.trueGray,
        "warm-gray": colors.warmGray,
        // red: colors.red,
        orange: colors.orange,
        amber: colors.amber,
        // yellow: colors.yellow,
        lime: colors.lime,
        // green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        // blue: colors.blue,
        // indigo: colors.indigo,
        violet: colors.violet,
        // purple: colors.purple,
        fuchsia: colors.fuchsia,
        // pink: colors.pink,
        rose: colors.rose,

      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
