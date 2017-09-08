import "./browser"

import Vue from "vue"
import VueRouter from "vue-router"

import routes from "./../../src/client/routes"

Vue.config.productionTip = false

export default Vue
export const initRouter = () => {
  Vue.use(VueRouter)

  return new VueRouter({ routes })
}
