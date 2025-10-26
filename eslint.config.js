import { defineConfig, globalIgnores } from 'eslint/config'
// @ts-expect-error - no types for this plugin
import nextVitals from 'eslint-config-next/core-web-vitals'
// @ts-expect-error - no types for this plugin
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
