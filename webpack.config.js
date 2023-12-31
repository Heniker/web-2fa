import { VuetifyPlugin } from 'webpack-plugin-vuetify'
import { VueLoaderPlugin } from 'vue-loader'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'

/**
 * @typedef {object} EnvT
 * @property {boolean} WEBPACK_SERVE
 * @property {boolean} WEBPACK_BUNDLE
 * @property {boolean} WEBPACK_BUIlD
 *
 * @property {boolean} BUILD_PAGES
 */

/**
 *
 * @param {EnvT} _
 * @param {{entry: string[], mode: string, env: EnvT}} argv
 */
export default async (_, argv) => {
  const isDev = argv.mode === 'development'
  const isServe = !!argv.env.WEBPACK_SERVE
  const isBuildPages = !!argv.env.BUILD_PAGES

  const htmlTemplate = './public/index.html'
  const publicPath = isBuildPages ? '/web-2fa/' : '/'
  const htmlFileName = isBuildPages ? '404.html' : 'index.html'

  /**
   * @type {import('webpack').Configuration & {devServer: any}}
   */
  const result = {
    devtool: isDev ? 'source-map' : false,
    resolve: {
      modules: ['node_modules', '.'],
      alias: {
        '@': 'src',
        // > uncomment if runtime template compiler is required
        // vue: 'vue/dist/vue.esm-bundler.js',
      },
      extensions: ['.js', '.vue', '.ts', '.tsx', '.jsx'],
    },
    optimization: {
      moduleIds: 'deterministic',
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 2016,
            keep_classnames: false,
            module: true,
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          // options: { experimentalInlineMatchResource: true },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-typescript', { allExtensions: true, isTSX: true }]],
              plugins: [
                ['@vue/babel-plugin-jsx'],
                ['@babel/plugin-proposal-decorators', { version: '2023-05' }],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          oneOf: [
            {
              resourceQuery: /module/,
              use: [
                isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    modules: {
                      mode: 'pure',
                      localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64]',
                    },
                  },
                },
              ],
            },
            {
              use: [
                isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    // modules: true,
                    // modules: { localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64]' },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    devServer: {
      ...(isServe && {
        host: '0.0.0.0',
        static: false,
        client: {
          overlay: false,
        },
        compress: true,
        historyApiFallback: true,
        hot: true,
        open: false,
      }),
    },
    plugins: [
      ...(isDev
        ? [
            new webpack.ProvidePlugin({
              assert: 'assert',
            }),
          ]
        : [
            new webpack.IgnorePlugin({
              resourceRegExp: /\.test|spec\./,
            }),
            new BundleAnalyzerPlugin(),
            new MiniCssExtractPlugin(),
          ]),
      new webpack.DefinePlugin({
        // https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
        // https://github.com/vuejs/core/blob/main/packages/global.d.ts
        __DEV__: JSON.stringify(false),
        __FEATURE_SUSPENSE__: JSON.stringify(false),
        __VUE_OPTIONS_API__: JSON.stringify(false),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),

        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
        'process.env.NODE_DEBUG': JSON.stringify(false),
        'process.version': JSON.stringify(process.version),
        'process.stderr': JSON.stringify(false), // https://github.com/browserify/commonjs-assert/issues/55

        PUBLIC_PATH: JSON.stringify(publicPath),
      }),
      new VueLoaderPlugin(),
      new VuetifyPlugin({}),
      new HtmlWebpackPlugin({
        filename: htmlFileName,
        template: htmlTemplate,
      }),
    ],
    output: {
      clean: true,
      filename: 'js/[name].[contenthash].js',
      publicPath,
      chunkFilename: 'js/[id].[contenthash].bundle.js',
    },
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
    experiments: {
      topLevelAwait: true,
      cacheUnaffected: true,
      asyncWebAssembly: true,
    },
  }

  return result
}
