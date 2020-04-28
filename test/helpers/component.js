import Vue from "vue"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import Vuex from "vuex"

Vue.config.devtools = false
Vue.config.productionTip = false

import { mount as mountVue, createLocalVue } from "@vue/test-utils"

import routes from "~/client/routes"
import store from "~/client/store/index"

Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.use(Vuex)

const localVue = createLocalVue()
const vuetify = new Vuetify()

export const mount = (component, options) => {
  return mountVue(component, {
    localVue,
    vuetify,
    ...options
  })
}

export const initRouter = () => {
  return new VueRouter({ routes })
}

export const initStore = () => {
  return new Vuex.Store(store)
}
