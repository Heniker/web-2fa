import { VueLoaderPlugin } from 'vue-loader'
import { getPortPromise } from 'portfinder'
import HtmlWebpackPlugin from 'html-webpack-plugin'

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
  const isServer = !!argv.env.WEBPACK_SERVE
  const port = isServer ? await getPortPromise({ port: 8080 }) : null
  const htmlTemplate = './public/index.html'

  /**
   * @type {import('webpack').Configuration & {devServer: any}}
   */
  const result = {
    devtool: isDev ? 'source-map' : false,
    resolve: {
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
              },
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
          historyApiFallback: true,
          hot: true,
          open: false,
          port,
        }
      : undefined,
    performance: {
      hints: false,
    },
    plugins: [
      new VueLoaderPlugin(),
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
    experiments: {
      futureDefaults: true,
      topLevelAwait: true,
    },
  }

  return result
}
