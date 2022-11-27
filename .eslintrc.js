/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    '@typescript-eslint/no-non-null-assertion': 0,
    'import/order': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
    '@typescript-eslint/explicit-member-accessibility': 'error',
    'no-console': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/no-cycle': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
  },
  overrides: [
    {
      files: ['packages/**/**'],
      rules: {
        'no-restricted-globals': [
          'error',
          {
            name: 'Buffer',
            message: 'Global buffer is not supported on all platforms. Import {buffer} from `buffer`',
          },
        ],
      },
    },
    {
      files: ['**/__tests__/**', '**/tests/**'],
      env: {
        jest: true,
        node: false,
      },
    },
  ],
}

// eslint-disable-next-line no-undef
module.exports = config
