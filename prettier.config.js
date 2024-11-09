/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',

  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}
