// eslint-disable-next-line no-undef
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: false, // Remove this line since we're not using JSX
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': [1, { allow: ['error', 'info'] }],
    'no-debugger': 1,
    '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }],
  },
};
