module.exports = {
  presets: [
    "@babel/preset-env"
  ],

  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-class-properties",
    ["transform-imports", {
      vuetify: {
        transform: "vuetify/src/components/${member}",
        preventFullImport: false
      }
    }],
    ["babel-plugin-webpack-alias-7", {
      config: "./config/webpack.config.js"
    }]
  ],

  env: {
    development: {
      sourceMaps: "inline",
    }
  }
}
