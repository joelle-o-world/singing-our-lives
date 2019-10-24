const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  //watch: true,
 
  resolve: {
    extensions: ['.js' ]
  },

  output: {
    filename: 'sol.bundle.js',
    path: path.resolve(__dirname, 'public'),
    library: 'SingingOurLives',
    libraryTarget: 'window',
    libraryExport: 'default'
  }
};