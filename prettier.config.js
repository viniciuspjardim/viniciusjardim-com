/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',

  /*
   * Prettier tailwindcss plugin config for sorting classes.
   * See Tailwind CSS IntelliSense extension config in `.vscode/settings.json`
   */
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindAttributes: ['class', 'classes', 'className', 'classNames'],
  tailwindFunctions: ['clsx', 'cva', 'cn'],
}

export default config
