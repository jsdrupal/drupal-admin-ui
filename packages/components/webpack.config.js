const { resolve } = require('path');
const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const productionPluginDefine =
  process.env.NODE_ENV === 'production'
    ? [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new MinifyPlugin(),
      ]
    : [];

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build'),
    library: '@drupal/admin-ui-components',
    libraryTarget: 'umd',
  },
  externals: ['react'],
  plugins: productionPluginDefine,
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties', 'emotion'],
            presets: [
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['last 2 versions'],
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
