const path = require('path')
const webpack = require('webpack')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { getPortPromise } = require('portfinder')

// known issues:
// https://github.com/vuetifyjs/vuetify/issues/13694

/**
 * @typedef {object} EnvT
 * @property {boolean} WEBPACK_SERVE
 */

/**
 *
 * @param {EnvT} _
 * @param {{entry: string[], mode: string, env: EnvT}} argv
 */
module.exports = async (_, argv) => {
  const isDev = argv.mode === 'development'
  const isServer = !!argv.env.WEBPACK_SERVE
  const port = isServer ? await getPortPromise({ port: 8080 }) : null
  const htmlTemplate = path.resolve(__dirname, './public/index.html')

  /**
   * @type {import('webpack').Configuration & {devServer: any}}
   */
  const result = {
    devtool: isDev ? 'source-map' : false,
    resolve: {
      extensions: ['.js', '.vue', '.ts'],
      alias: {
        vue: isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
      },
    },
    optimization: {
      removeAvailableModules: true,
      minimize: !isDev,
      minimizer: [
        new TerserPlugin({
          // sourceMap: true,

          terserOptions: {
            parse: {
              ecma: 2020,
            },
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
            compress: {
              pure_funcs: ['console.info', 'console.debug', 'console.warn', 'console.log'],
            },

            output: {
              comments: false,
            },
            // warnings: true, // do not even try
            module: true,
            toplevel: true,
            // ecma: 2015,

            mangle: true, // default value?
            // ie8: false, // default value
            // ecma: 5 // default value
          },
        }),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],

      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        // chunks: 'initial',
        chunks: 'all',
      },
    },
    module: {
      rules: [
        // ...(isDev
        //   ? []
        //   : [
        //       {
        //         enforce: 'pre',
        //         test: /\.(js|vue)$/,
        //         loader: 'eslint-loader',
        //         exclude: /node_modules/,
        //       },
        //     ]),
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          resourceQuery: /blockType=i18n/,
          type: 'javascript/auto',
          loader: '@intlify/vue-i18n-loader',
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|png|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets',
              },
            },
          ],
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
              },
            },
            'less-loader',
          ],
        },
        {
          test: /\.styl(us)?$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
              },
            },
            'stylus-loader',
          ],
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
                    sourceMap: isDev,
                    modules: {
                      localIdentName: isDev ? '[local]_[hash:base64:5]' : '[hash:base64]',
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
                    sourceMap: isDev,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    devServer: isServer
      ? {
          static: false,
          client: {
            overlay: false,
          },
          compress: true,
          // host: '0.0.0.0',
          historyApiFallback: true,
          hot: true,
          open: false,
          port,
        }
      : undefined,
    performance: {
      hints: false,
    },
    stats: 'summary',
    plugins: [
      new VueLoaderPlugin(),
      new VuetifyLoaderPlugin(),
      new webpack.DefinePlugin({
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      }),
      new webpack.ProvidePlugin({
        assert: 'assert',
      }),
      new HtmlWebpackPlugin({
        // favicon: 'public/favicon.ico',
        template: htmlTemplate,
      }),
      new MiniCssExtractPlugin({
        filename: 'style/[name].[hash].css',
        chunkFilename: 'style/[id].[hash].css',
        ignoreOrder: false,
      }),
      ...(isServer ? [] : [new WebpackBundleAnalyzer({ openAnalyzer: false })]),
    ],
    output: {
      clean: true,
      filename: 'js/[name].[hash].js',
      publicPath: '/',
      chunkFilename: 'js/[id].[hash].bundle.js',
      libraryTarget: 'umd',
    },
    experiments: {
      futureDefaults: true,
      topLevelAwait: true,
      // lazyCompilation: isDev && isServer, // lazy compilation does not do much in this case
    },
  }

  return result
}
