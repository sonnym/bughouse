module.exports = {
  extends: [
    "eslint:recommended",
    'plugin:vue/recommended'
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
  ],

  rules: {
    "no-unused-vars": ["error", { args: "none" }]
  }
}
