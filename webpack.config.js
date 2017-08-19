module.exports = {
  entry: "./src/client/index.js",
  output: {
    filename: "public/bundle.js",
    sourceMapFilename: "public/bundle.map"
  },
  devtool: "#source-map"
}
