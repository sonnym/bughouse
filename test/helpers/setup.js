const babelRegister = require("@babel/register")

const browserEnv = require("browser-env")
const hooks = require("require-extension-hooks")

browserEnv({ pretendToBeVisual: true })

hooks("vue").plugin("vue").push()
hooks(["vue", "js"]).exclude(({ filename }) => {
  return (
    /\/node_modules\//.test(filename) ||
    /webpack\.config\.js/.test(filename)
  )
}).plugin("babel").push()

babelRegister({ only: ["src", "test"] })
