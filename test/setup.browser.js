require("browser-env")({ pretendToBeVisual: true })

const hooks = require("require-extension-hooks")

hooks("vue").plugin("vue").push()
hooks(["vue", "js"]).exclude(({ filename }) => {
  return (
    /\/node_modules\//.test(filename) ||
    /webpack\.config\.js/.test(filename)
  )
}).plugin("babel").push()
