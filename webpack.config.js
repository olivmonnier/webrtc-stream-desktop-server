const { join } = require('path')
const APP_DIR = join(__dirname, 'src')
const BUILD_DIR = join(__dirname, 'public')

module.exports = {
  entry: join(APP_DIR, 'app.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test:/\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2017']
          }
        }]
      }
    ]
  }
}