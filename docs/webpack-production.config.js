const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  entry: [
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
    contentBase: 'build',
    outputPath: buildPath,
  },
  output: {
    path: buildPath,
    filename: 'app.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.NoErrorsPlugin(),
    new CopyWebpackPlugin([
      {from: 'src/www/css', to: 'css'},
      {from: 'src/www/index.html'},
    ]),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
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
