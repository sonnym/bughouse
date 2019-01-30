import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import Vuex from "vuex"

import routes from "./../../src/client/routes"
import store from "./../../src/client/store"

Vue.config.productionTip = false

Vue.use(Vuetify)

export default Vue
export const initRouter = () => {
  Vue.use(VueRouter)

  return new VueRouter({ routes })
}

export const initStore = () => {
  Vue.use(Vuex)

  return new Vuex.Store(store)
}
