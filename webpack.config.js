const path = require('path');

module.exports = {
  entry: {
    sol: './src/index.js', 
    polyfill: './src/polyfill.js'
  },
  mode: 'development',
  watch: false, // otherwise it will pause npm build indefinitely.
  // If you need to watch use the -w command line flag.

  resolve: {
    extensions: ['.js' ]
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    library: 'SingingOurLives',
    libraryTarget: 'window',
    libraryExport: 'default'
  }
};
