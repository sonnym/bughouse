module.exports = {
  extends: "eslint:recommended",

  parser: "babel-eslint",

  parserOptions: {
    ecmaVersion: 8
  },

  overrides: [
    {
      files: "src/client/**/*.js",
      env: {
        browser: true
      }
    }
  ]
}
