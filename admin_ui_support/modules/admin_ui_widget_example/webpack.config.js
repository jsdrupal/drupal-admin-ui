const path = require('path');
const WPAsyncDefine = require('webpack-async-define');

module.exports = {
  entry: {
    options_buttons_widget: './js/src/options_buttons.widget.js',
  },
  optimization: {
    minimize: false,
  },
  output: {
    libraryTarget: 'amd',
    library: 'jsDrupal_[name]',
    path: path.resolve(__dirname, 'js', 'build'),
    filename: '[name].js',
  },
  plugins: [new WPAsyncDefine()],
  externals: [
    'react',
    'react-dom',
    '@material-ui/core',
    /@material-ui\/core\/*./,
  ],
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
