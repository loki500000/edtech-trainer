const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    code: './src/plugin/code.ts',
    ui: './src/ui/ui.ts',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui/ui.html',
      filename: 'ui.html',
      chunks: ['ui'],
      inject: 'body',
    }),
  ],
});
