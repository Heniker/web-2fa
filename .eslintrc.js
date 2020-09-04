// eslint config for .vue and .ts files

// derived from configs created by @vue/cli
// it just works (maybe)

module.exports = {
  root: true,
  env: {
    // node: true,
    // browser: true,
    es2020: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    extraFileExtensions: ['.vue'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'import',
    'vuetify',
    'promise',
    'unicorn',
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:import/warnings',
    'plugin:import/errors',
    'plugin:import/typescript',
    'prettier',
    'prettier/vue',
    'prettier/@typescript-eslint',
  ],
  settings: {
    'import/resolver': {
      [require.resolve('eslint-import-resolver-node')]: {},
      [require.resolve('eslint-import-resolver-webpack')]: {
        config: 'webpack.config.js',
      },
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      { singleQuote: true, endOfLine: 'auto', semi: false },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-param-reassign': [
      'warn',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e', // for e.returnvalue
        ],
      },
    ],

    // single or double - choose either, but this is a required rule
    quotes: ['error', 'single'],

    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error',
    'vuetify/no-deprecated-classes': 'error',

    // #region rules that allow usage of plugin:vue/vue3 for vue2 files.
    // comment out if you're on vue 3

    'vue/no-deprecated-dollar-scopedslots-api': ['off'],
    // #endregion

    // #region optional rules that can be safely disabled
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'linebreak-style': 'off',
    semi: ['error', 'never'],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-shadow': ['warn'],
    'import/prefer-default-export': 'off',

    'unicorn/prevent-abbreviations': 'off',
    // Once Vetur rolls out Rename.symbol support - I'll stop using different .ts files for vue
    'unicorn/filename-case': 'off',
    'no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true, allowTypedFunctionExpressions: true },
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    // #endregion
  },

  globals: {
    process: 'readonly',
  },
}
