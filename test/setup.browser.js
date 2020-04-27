require("browser-env")({ pretendToBeVisual: true })

window.Date = Date

const hooks = require("require-extension-hooks")
const Vue = require("vue")

Vue.config.devtools = false
Vue.config.productionTip = false

hooks("vue").plugin("vue").push()
hooks(["vue", "js"]).exclude(({ filename }) => {
  return (
    /\/node_modules\//.test(filename) ||
    /webpack\.config\.js/.test(filename)
  )
}).plugin("babel").push()
