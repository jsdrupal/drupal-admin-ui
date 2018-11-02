const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const config = {
  entry: {
    options_buttons_widget: './js/src/options_buttons.widget.js',
  },
  optimization: {
    minimize: false,
  },
  output: {
    libraryTarget: 'umd',
    library: 'jsDrupal_[name]',
    path: path.resolve(__dirname, 'js', 'build'),
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

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.plugins.push(new MinifyPlugin());
  }
  return config;
};
