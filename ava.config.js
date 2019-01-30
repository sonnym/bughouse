export default {
  require: [
    "./test/helpers/setup.js"
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
