module.exports = {
  presets: [
    "@babel/preset-env"
  ],

  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-object-rest-spread",
    "add-filehash", [
      "transform-imports",
      {
        vuetify: {
          transform: "vuetify/src/components/${member}",
          preventFullImport: false
        }
      }
    ]
  ],

  env: {
    development: {
      "sourceMaps": "inline"
    }
  }
}
