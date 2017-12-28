import "./browser"

import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"

import routes from "./../../src/client/routes"

Vue.config.productionTip = false
Vue.use(Vuetify)

export default Vue
export const initRouter = () => {
  Vue.use(VueRouter)

  return new VueRouter({ routes })
}
