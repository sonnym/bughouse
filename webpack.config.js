module.exports = {
  entry: "./src/client.js",
  output: {
    filename: "public/bundle.js",
    sourceMapFilename: "public/bundle.map"
  },
  devtool: "#source-map"
}
