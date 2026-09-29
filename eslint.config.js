import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  { ignores: ['packages/e2e-integration/fixtures/sample.icon-theme-error-invalid-json/icon-theme.json'] },
  ...config.recommendedActions,
  {
    rules: {
      '@cspell/spellchecker': 'off',
    },
  },
  {
    // The pinned application supplies its own Node runtime.
    files: ['.github/workflows/integration.yml'],
    rules: { 'github-actions/node-version-file': 'off', 'github-actions/on': 'off' },
  },
  {
    // The application runner supplies mutable API objects to these scenarios.
    files: ['packages/e2e-integration/src/**/*.ts'],
    rules: { '@typescript-eslint/prefer-readonly-parameter-types': 'off' },
  },
])
