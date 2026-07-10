import { createRequire } from 'module';

const require = createRequire(import.meta.url);
/** @type {import('eslint').Linter.Config[]} */
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
