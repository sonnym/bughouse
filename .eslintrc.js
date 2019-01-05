module.exports = {
  extends: [
    "eslint:recommended",
    'plugin:vue/base'
  ],

  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 8
  },

  env: {
    node: true
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
