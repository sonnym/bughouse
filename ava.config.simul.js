export default {
  files: [
    "test/simul/**/*"
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
