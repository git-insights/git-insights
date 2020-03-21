module.exports = {
  'env': {
    'es6': true,
    'node': true,
  },
  'extends': 'eslint:recommended',
  'plugins': [
    'prettier'
  ],
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'error',
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'switch-colon-spacing': 'error',
    'default-case': 'error',
  }
}