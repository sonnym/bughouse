var resolve = require("path").resolve

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
      loader: "babel-loader",
      include: [
        resolve(__dirname, "..", "src"),
        resolve(__dirname, "..", "node_modules", "vuetify")
      ]
    }, {
      test: /\.vue$/,
      loader: "vue-loader",
      include: [
        resolve(__dirname, "..", "src"),
        resolve(__dirname, "..", "node_modules", "vuetify")
      ],
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(["css-loader?sourceMap", "sass-loader?sourceMap"])
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
