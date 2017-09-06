import browserEnv from "browser-env"
import hooks from "require-extension-hooks"
import Vue from "vue"

browserEnv()

Vue.config.productionTip = false;
hooks("vue").plugin("vue").push()
hooks(["vue", "js"]).plugin("babel").push()
