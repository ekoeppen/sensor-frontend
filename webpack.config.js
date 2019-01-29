module.exports = {
  entry: [
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader', options: {
              includePaths: ['./node_modules']
            }
          }
        ]
      },

    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.scss', '.css', '.json']
  },
};
