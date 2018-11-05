#!/usr/bin/env node

// Set NodeCofig directory
process.env.NODE_CONFIG_DIR = `${process.cwd()}/jsDrupalConfig/`;

const webpack = require('webpack');
const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const config = require('config');

const webpackConfig = {
  entry: Object.assign({}, config.get('entry')),
  optimization: {
    minimize: false,
  },
  output: {
    libraryTarget: 'umd',
    library: 'jsDrupal_[name]',
    path: path.resolve(process.cwd(), 'js', 'build'),
    filename: '[name].js',
  },
  plugins: [],
  externals: ['react', '@material-ui/core', /@material-ui\/core\/*./],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties'],
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

if (config.has('mode') && config.get('mode') === 'production') {
  webpackConfig.plugins.push(new MinifyPlugin());
}

webpack(webpackConfig).run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(
    stats.toString({
      chunks: false,
      colors: true,
    }),
  );
});
