export default {
  files: [
    "test/**/*.test.js",
    "!test/client/**/*",
    "!test/simul/**/*"
  ],
  require: [
    "./test/setup.server.js"
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
