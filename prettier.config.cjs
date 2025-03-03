/** @type {import("prettier").Config} */
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
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindAttributes: ['class', 'classes', 'className', 'classNames'],
  tailwindFunctions: ['clsx', 'cva', 'cn'],
}

module.exports = config
