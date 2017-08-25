module.exports = {
  entry: "./src/client/index.js",
  output: {
    filename: "public/bundle.js",
    sourceMapFilename: "public/bundle.map"
  },
  devtool: "#source-map",
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }]
  }
}
