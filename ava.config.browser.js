export default {
  files: [
    "test/client/**/*.test.js"
  ],
  require: [
    "./test/setup.browser.js"
  ],
  environmentVariables: {
    NODE_ENV: "production",

    REDIS_SESSION_STORE_URL: "redis://localhost:6379/2",
    REDIS_APPLICATION_STORE_URL:  "redis://localhost:6379/3"
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
