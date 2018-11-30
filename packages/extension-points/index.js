#!/usr/bin/env node
const { promisify } = require('util');
const { readFile } = require('fs');
const { basename, resolve } = require('path');
const { mode } = require('minimist')(process.argv.slice(2));
const jsyaml = require('js-yaml');
const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const [readFilePM] = [readFile].map(promisify);
const operatingDirectory = process.cwd();

Promise.all([
  readFilePM(
    `${operatingDirectory}/${basename(
      operatingDirectory,
    )}.admin_ui.components.yml`,
  ),
  readFilePM(
    `${operatingDirectory}/${basename(operatingDirectory)}.admin_ui.routes.yml`,
  ),
])
  .then(([components, routes]) => ({
    components: jsyaml.safeLoad(components),
    routes: jsyaml.safeLoad(routes),
  }))
  .then(({ components, routes }) => ({
    ...Object.entries(components.widgets).reduce(
      (acc, [key, { component }]) => ({
        ...acc,
        ...{ [`${key}.widget`]: `./js/src/${basename(component)}` },
      }),
      {},
    ),
    ...Object.entries(routes.routes).reduce(
      (acc, [key, { component }]) => ({
        ...acc,
        ...{ [`${key}.route`]: `./js/src/${basename(component)}` },
      }),
      {},
    ),
  }))
  .then(entry => {
    const webpackConfig = {
      entry,
      mode,
      optimization: {
        minimize: false,
      },
      output: {
        libraryTarget: 'umd',
        library: 'jsDrupal_[name]',
        path: resolve(operatingDirectory, 'js', 'build'),
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
    if (mode === 'production') {
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
  })
  .catch(err => {
    console.error('An error occurred while building the JS files.', err);
    process.exit(1);
  });
