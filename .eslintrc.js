/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  env: {
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/no-non-null-assertion': 0,
    'import/order': 2,
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
