import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import Vuex from "vuex"

import routes from "./../../src/client/routes"
import store from "./../../src/client/store"

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.use(Vuex)

export default Vue

export const initRouter = () => {
  return new VueRouter({ routes })
}

export const initStore = () => {
  return new Vuex.Store(store)
}
