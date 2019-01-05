const resolve = require("path").resolve

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

module.exports = {
  mode: "none",

  entry: [
    "./src/client/index.js",
    "./src/client/styles/main.scss",
  ],

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
      include: [
        resolve(__dirname, "..", "src")
      ]
    }, {
      test: /\.vue$/,
      loader: "vue-loader",
      include: [
        resolve(__dirname, "..", "src")
      ]
    }, {
      test: /\.scss$/,
      use: [
        { loader: MiniCssExtractPlugin.loader },
        "css-loader",
        "sass-loader"
      ]
    }, {
      test: /\.styl$/,
      use: [
        { loader: MiniCssExtractPlugin.loader },
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

    new VueLoaderPlugin()
  ]
}
