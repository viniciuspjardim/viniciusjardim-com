/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
