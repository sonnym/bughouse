import { inspect } from "util"

import browserEnv from "browser-env"
import hooks from "require-extension-hooks"
import Vue from "vue"

process.on("uncaughtException", (err) => {
  console.log("EXCEPTION:")
  console.log(inspect(err))
})

browserEnv()

// Setup Vue.js to remove production tip
Vue.config.productionTip = false;

// Setup vue files to be processed by `require-extension-hooks-vue`
hooks("vue").plugin("vue").push()

// Setup vue and js files to be processed by `require-extension-hooks-babel`
hooks(["vue", "js"]).plugin("babel").push()
