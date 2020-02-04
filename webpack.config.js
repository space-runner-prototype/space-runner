module.exports = {
  entry: ['./index.js'], // assumes your entry point is the index.js in the root of your project folder
  output: {
    path: __dirname, // assumes your bundle.js will also be in the root of your project folder
    publicPath: '/',
    filename: 'bundle.js',
  },
  devtool: 'source-maps',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
};
