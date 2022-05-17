// if you find some rules irrelevant for your use case - disable them.
// Do not use @eslint-ignore - decrease severity instead
// eslint exists to help you write code. Ignore it if you think your use case is legit

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
    // ecmaFeatures: {
    //   jsx: true,
    // },
  },
  plugins: ['@typescript-eslint', 'prettier', 'import', 'promise', 'unicorn'],
  extends: [
    'airbnb-typescript/base',
    'plugin:vue/vue3-recommended',
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
      [require.resolve('eslint-import-resolver-typescript')]: {},
      [require.resolve('eslint-import-resolver-node')]: {},
      // [require.resolve('eslint-import-resolver-webpack')]: {
      //   config: path.resolve(__dirname, './build/webpack.config.js'),
      // },
    },
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // https://github.com/vuejs/vue-eslint-parser#️-known-limitations
      },
    },
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        htmlWhitespaceSensitivity: 'ignore',
        printWidth: 100,
        semi: false,
        singleQuote: true,
      },
    ],
    'unicorn/filename-case': ['off'],
    'vue/no-deprecated-dollar-scopedslots-api': ['off'],
  },

  globals: {
    process: 'readonly',
  },
}
