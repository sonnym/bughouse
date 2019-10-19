export default {
  require: [
    "./test/helpers/setup.js"
  ],
  helpers: [
    "**/helpers/**/*"
  ],
  "babel": {
    "testOptions": {
      "plugins": [
        ["babel-plugin-webpack-alias-7", {
          "config": "./config/webpack.config.js"
        }]
      ]
    }
  }
}
