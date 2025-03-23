module.exports = {
  extends: 'erb',
  plugins: ['@typescript-eslint'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn', // Downgrade to warning
    'react/require-default-props': 'off', // Disable default props requirement
    'react/function-component-definition': [
      'warn',
      {
        namedComponents: ['function-declaration', 'arrow-function'],
        unnamedComponents: ['arrow-function'],
      },
    ],
    'no-console': 'warn', // Downgrade to warning
    'no-restricted-globals': 'warn', // Downgrade to warning
    'react-hooks/exhaustive-deps': 'warn', // Downgrade to warning
    'default-case': 'warn', // Downgrade to warning
    'react/jsx-no-constructed-context-values': 'warn', // Downgrade to warning
  },
};
