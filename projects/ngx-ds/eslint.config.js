// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'ngx', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'ngx', style: 'camelCase' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // No-op CVA defaults / setDisabledState vacíos
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['arrowFunctions', 'methods'] },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }],
      // TODO a11y: corregir y volver a 'error'
      '@angular-eslint/template/click-events-have-key-events': 'warn',
      '@angular-eslint/template/interactive-supports-focus': 'warn',
      '@angular-eslint/template/label-has-associated-control': 'warn',
      '@angular-eslint/template/role-has-required-aria': 'warn',
    },
  },
  {
    files: ['**/stories/**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
