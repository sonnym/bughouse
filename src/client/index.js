import Vue from "vue"
import Vuex from "vuex"
import VueRouter from "vue-router"

import Vuetify from "vuetify/lib"

import "vuetify/src/stylus/app.styl"

import routes from "./routes"
import store from "./store"

import App from "./components/app"

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Vuetify)

new Vue({
  el: '#app',
  store: new Vuex.Store(store),
  router: new VueRouter({ routes }),
  render: (h) => h(App)
})

window.bughouse = bughouse()
