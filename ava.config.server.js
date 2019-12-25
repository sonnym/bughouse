export default {
  files: [
    "test/**/*.test.js",
    "test/simulation.test.js",
    "!test/client/**/*"
  ],
  require: [
    "./test/setup.server.js"
  ],
  helpers: [
    "**/helpers/**/*"
  ],
  environmentVariables: {
    NODE_ENV: "test"
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
