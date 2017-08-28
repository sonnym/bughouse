var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: [
    "./src/client/index.js",
    "./src/styles/main.scss",
  ],
  output: {
    filename: "public/bundle.js",
    sourceMapFilename: "[file].map"
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
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
    }]
  },

	plugins: [
    new ExtractTextPlugin({
      filename: "public/bundle.css",
      allChunks: true
    })
	]
}
