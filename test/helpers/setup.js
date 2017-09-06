import { inspect } from "util"

import browserEnv from "browser-env"
import hooks from "require-extension-hooks"
import Vue from "vue"

process.on("uncaughtException", (err) => {
  console.log("EXCEPTION:")
  console.log(inspect(err))
})

browserEnv()

Vue.config.productionTip = false;
hooks("vue").plugin("vue").push()
hooks(["vue", "js"]).plugin("babel").push()
