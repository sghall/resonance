const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'src/www');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  entry: [
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    './node_modules/babel-polyfill/lib/index.js',
    path.resolve(__dirname, 'src/index.js'),
  ],
  resolve: {
    extensions: ['', '.js', '.md', '.txt'],
    alias: {
      docs: path.resolve(__dirname, '../docs'),
      resonance: path.resolve(__dirname, '../src'),
    },
  },
  devServer: {
    contentBase: 'src/www',
    devtool: 'eval',
    hot: true,
    inline: true,
    port: 3000,
    outputPath: buildPath,
  },
  devtool: 'source-map',
  output: {
    path: buildPath,
    filename: 'app.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/www/index.html' },
    ]),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
        include: path.resolve(__dirname, 'src/app/components/raw-code'),
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  eslint: {
    configFile: '../.eslintrc',
  },
};

module.exports = config;
