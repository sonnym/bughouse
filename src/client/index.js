import Vue from "vue"
import Vuex from "vuex"
import VueRouter from "vue-router"

import Vuetify from "vuetify/lib"

import routes from "./routes"
import store from "./store/index"

import Bughouse from "./components/Bughouse"
import bootstrap from "./bootstrap"

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Vuetify)

new Vue({
  created: bootstrap,
  store: new Vuex.Store(store),
  vuetify: new Vuetify({ theme: { dark: true } }),
  router: new VueRouter({ routes }),
  render: (h) => h(Bughouse)
}).$mount("#bughouse")
