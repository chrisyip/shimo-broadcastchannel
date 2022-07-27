import webpack, { Configuration } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import path from 'path'
import pkg from './package.json'

const isProduction = process.env.NODE_ENV === 'production'

const config: Configuration = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? undefined : 'inline-source-map',
  entry: {
    'shimo-broadcast-channel': './src/index'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(pkg.version)
    })
  ]
}

export default config
