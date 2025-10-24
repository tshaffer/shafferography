// frontend/webpack.config.js
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',

  // Make the entry explicit so webpack doesn’t try to resolve "./src"
  entry: path.resolve(__dirname, 'src/index.tsx'),

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
  },

  devtool: 'source-map',
  target: 'web',

  resolve: {
    // Ensure TS/TSX are resolved (so it tries .tsx/.ts before .js)
    extensions: ['.tsx', '.ts', '.js', '.json', '.css'],
    // (Optional) If you need TS path aliases, add TsconfigPathsPlugin later.
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: 'images/[hash]-[name].[ext]' },
          },
        ],
      },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),

    // You're on an older copy-webpack-plugin, so keep the ARRAY syntax:
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'build/bundle.js'),
        to: path.resolve(__dirname, '../backend/public/build'),
      },
      {
        from: path.resolve(__dirname, 'build/bundle.js.map'),
        to: path.resolve(__dirname, '../backend/public/build'),
      },
    ]),

    new webpack.ProgressPlugin((percentage) => {
      if (percentage === 1) {
        console.log(
          `\x1b[32m[Webpack Build Complete]\x1b[0m ${new Date().toLocaleString()}`
        );
      }
    }),
  ],
};
