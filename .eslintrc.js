module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: 'next',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
  },
};
