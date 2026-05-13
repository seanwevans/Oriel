import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      // Generated and bundled artifacts are not source of truth for linting.
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      // Static images, shader snippets, and corpus data include asset-specific syntax/content.
      'src/assets/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Legacy app initializers share positional signatures even when an app omits some services.
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
        destructuredArrayIgnorePattern: '^_',
      }],
      // Terminal/app emulators intentionally use ANSI-control regexes and generated SVG/template snippets.
      'no-control-regex': 'off',
      'no-useless-escape': 'off',
      // Several state-machine style apps predeclare reassigned placeholders for branch-specific flows.
      'no-useless-assignment': 'off',
      // UI wrappers sometimes replace low-level parsing/import errors with user-facing messages.
      'preserve-caught-error': 'off',
      // Empty catch blocks are used only where optional browser/game APIs can fail silently.
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['src/**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['src/installer.js'],
    languageOptions: {
      globals: {
        // The installer exposes env metadata when bundled/tested under Node-compatible tooling.
        process: 'readonly',
      },
    },
  },
];
