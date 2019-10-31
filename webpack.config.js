const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  watch: false, // otherwise it will pause npm build indefinitely.
  // If you need to watch use the -w command line flag.
 
  resolve: {
    extensions: ['.js' ]
  },

  output: {
    filename: 'sol.bundle.js',
    path: path.resolve(__dirname, 'public'),
    library: 'RecorderInterface',
    libraryTarget: 'window',
    libraryExport: 'RecorderInterface'
  }
};