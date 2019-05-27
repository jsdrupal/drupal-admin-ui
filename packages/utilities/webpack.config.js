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

const jsOptions = {
  plugins: ['@babel/plugin-proposal-class-properties'],
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            'ios >= 10.3',
            'chrome >= 55',
            'firefox >= 53',
            'safari >= 10.3',
            'ChromeAndroid >= 70',
            'edge >= 15',
            'opera >= 42',
          ],
        },
      },
    ],
  ],
};

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'build'),
    library: '@drupal/admin-ui-utilities',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: productionPluginDefine,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: jsOptions,
        },
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: jsOptions,
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
};
