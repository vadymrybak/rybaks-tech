const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const argv = require('minimist')(process.argv.slice(2));
const lerna = require('./lerna.json');

const production = argv.mode === 'production';
const host = 'localhost:3000';
const baseURL = `http://${host}`;
const clientPort = process.env.CLIENT_PORT ? process.env.CLIENT_PORT : 10000;

module.exports = {
  output: {
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css', '.scss', '.less'],
    fallback: {
      path: require.resolve('path-browserify'),
      util: require.resolve('util-browserify'),
      process: require.resolve('process/browser'),
    },
    alias: {
      process: 'process',
      '~': `${process.cwd()}/src`,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.build.json',
          },
        },
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: { name: 'index.html' },
          },
          {
            loader: 'pug-html-loader',
            options: { data: {} },
          },
        ],
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: [
          'style-loader',
          // MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: process.env.NODE_ENV === 'development',
              modules: {
                auto: true,
                // this line configure auto-generated classnames. See: [documentation](https://webpack.js.org/loaders/css-loader/#localidentname)
                localIdentName:
                  process.env.NODE_ENV === 'development'
                    ? `[local]_[hash:base64:10]`
                    : `[hash:base64:10]`,
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
                auto: true,
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        // exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
                auto: true,
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|ttf|eot|gif|png|jpe?g|bmp|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
      'process.env.baseURL': JSON.stringify(production ? null : baseURL),
      'process.env.host': JSON.stringify(production ? null : host),
      'process.env.VERSION': JSON.stringify(lerna.version),
    }),
    new MiniCssExtractPlugin({ filename: 'style.css' }),
  ],
  optimization: {
    minimize: production,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          parse: {},
          compress: {},
          module: false,
          ecma: 6,
          mangle: false,
          keep_classnames: true,
          keep_fnames: false,
        },
      }),
      new CssMinimizerPlugin({
        parallel: true,
      }),
    ],
  },
  devServer: {
    // contentBase: 'dist',
    static: 'dist',
    compress: true,
    port: clientPort,
    hot: true,
  },
};
