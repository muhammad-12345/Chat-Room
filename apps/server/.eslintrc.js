module.exports = {
  extends: ['@chat-room/config/eslint-base.js'],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Node.js specific rules
    'no-process-env': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
}
