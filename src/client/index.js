import Vue from "vue"
import Vuex from "vuex"
import VueRouter from "vue-router"

import Vuetify from "vuetify/lib"

import routes from "./routes"
import store from "./store"

import App from "./components/app"
import bughouse from "./bughouse"

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Vuetify)

new Vue({
  beforeCreate: bughouse,
  store: new Vuex.Store(store),
  vuetify: new Vuetify({ theme: { dark: true } }),
  router: new VueRouter({ routes }),
  render: (h) => h(App)
}).$mount("#app")
