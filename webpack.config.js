const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const contextPath = path.resolve(__dirname, './src/app')
const outputPath = path.resolve(__dirname, './build')

const plugins = [
  new HtmlWebpackPlugin({
    inject: true,
    template: './index.html',
  }),
  new CopyWebpackPlugin([{ from: './static' }])
]

const appEntry = []

// dev only stuff
appEntry.push('react-hot-loader/patch')
appEntry.push('webpack-hot-middleware/client')
appEntry.push('babel-polyfill')
plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
)

// main entry point
appEntry.push('./index.js')

module.exports = {
  entry: {
    app: appEntry,
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name]-bundle.js',
    publicPath: '/',
    path: outputPath,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
    ]
  },
  context: contextPath,
  plugins,
  resolve: {
    alias: {
      core: path.resolve(__dirname, 'src/app/core'),
      openstack: path.resolve(__dirname, 'src/app/plugins/openstack')
    }
  }
}
