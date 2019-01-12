const resolve = require("path").resolve

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin")

module.exports = {
  mode: process.env.NODE_ENV,

  entry: "./src/client/index.js",

  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "..", "public"),
    sourceMapFilename: "[file].map"
  },

  devtool: "#source-map",

  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
      exclude: /node_modules/
    }, {
      test: /\.vue$/,
      loader: "vue-loader",
    }, {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "sass-loader"
      ]
    }, {
      test: /\.styl$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "stylus-loader"
      ]
    }]
  },

  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      "vue$": "vue/dist/vue.esm.js",
    }
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "bundle.css"
    }),

    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin()
  ]
}
