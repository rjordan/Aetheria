module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // Remove semicolons
    'semi': ['error', 'never'],

    // Additional formatting rules
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',

    // Turn off some problematic rules for TypeScript
    'no-unused-vars': 'off',
    'no-undef': 'off', // TypeScript handles this
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.js',
  ],
}
