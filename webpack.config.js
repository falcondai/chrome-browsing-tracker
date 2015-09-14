module.exports = {
  entry: {
    eventPage: './src/eventPage.js',
    options: './src/options.jsx'
  },
  output: {
    path: './dist',
    filename: '[name].js',
  },
  module: {
    loaders: [{
      test: [/\.js$/, /\.jsx$/],
      loaders: ['babel']
    },
    // {
    //   test: require.resolve('react'),
    //   loaders: ['expose?React']
    // }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
