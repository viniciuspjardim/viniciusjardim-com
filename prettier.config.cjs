/** @type {import("prettier").Config} */
const config = {
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',

  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}

module.exports = config
