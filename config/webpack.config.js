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

  devServer: {
    hot: true
  },

  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
      exclude: /node_modules/
    }, {
      test: /\.js$/,
      use: "imports-loader?define=>undefined",
      include: /node_modules\/chess.js/,
    }, {
      test: /\.vue$/,
      loader: "vue-loader",
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader"
      ]
    }, {
      test: /\.s[ac]ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
          loader: "sass-loader",
          options: {
            implementation: require("sass")
          }
        }
      ]
    }]
  },

  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      "~": resolve(__dirname, "..", "src"),
      "@": resolve(__dirname, "..", "test/helpers")
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
