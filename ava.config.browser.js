export default {
  files: [
    "test/client/**/*.test.js"
  ],
  require: [
    "./test/setup.browser.js"
  ],
  environmentVariables: {
    NODE_ENV: "production"
  },
  babel: {
    testOptions: {
      plugins: [
        ["babel-plugin-webpack-alias-7", {
          "config": "./config/webpack.config.js"
        }]
      ]
    }
  }
}
