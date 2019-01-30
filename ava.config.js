export default {
  require: [
    "@babel/register"
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
