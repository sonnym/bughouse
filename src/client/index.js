import Vue from "vue"
import Vuex from "vuex"
import VueRouter from "vue-router"
import Vuetify from "vuetify"

import bughouse from "./bughouse"
import routes from "./routes"

import App from "./components/app"

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Vuetify)

const store = new Vuex.Store({})

new Vue({
  el: '#app',
  store,
  router: new VueRouter({ routes }),
  render: (h) => h(App)
})

window.bughouse = bughouse()
