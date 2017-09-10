var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: [
    "./src/client/index.js",
    "./src/client/styles/main.scss",
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
        loader: "babel-loader",
        options: {
          presets: ["env"]
        }
      }
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(["css-loader?sourceMap", "sass-loader?sourceMap"])
    }, {
      test: /\.vue$/,
      loader: "vue-loader"
    }]
  },

  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      "vue$": "vue/dist/vue.esm.js",
    }
  },

  plugins: [
    new ExtractTextPlugin({
      filename: "public/bundle.css",
      allChunks: true
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      warnings: true,
      mangle: true
    })
  ]
}
