import { VuetifyPlugin } from 'webpack-plugin-vuetify'
import { VueLoaderPlugin } from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'

/**
 * @typedef {object} EnvT
 * @property {boolean} WEBPACK_SERVE
 */

/**
 *
 * @param {EnvT} _
 * @param {{entry: string[], mode: string, env: EnvT}} argv
 */
export default async (_, argv) => {
  const isDev = argv.mode === 'development'
  const isServe = !!argv.env.WEBPACK_SERVE
  const htmlTemplate = './public/index.html'

  /**
   * @type {import('webpack').Configuration & {devServer: any}}
   */
  const result = {
    devtool: false,
    resolve: {
      alias: {
        // > uncomment if runtime template compiler is required
        // vue: 'vue/dist/vue.esm-bundler.js'
      }
      extensions: ['.js', '.vue', '.ts'],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
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
    devServer: {
      ...(isServe && {
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
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
      }),
      new MiniCssExtractPlugin(),
      new VueLoaderPlugin(),
      new VuetifyPlugin(),
      new HtmlWebpackPlugin({
        template: htmlTemplate,
      }),
    ],
    output: {
      clean: true,
      filename: 'js/[name].[contenthash].js',
      publicPath: '/',
      chunkFilename: 'js/[id].[contenthash].bundle.js',
    },
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
  }

  return result
}
