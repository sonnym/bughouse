import Vue from "vue"
import VueRouter from "vue-router"
import Vuetify from "vuetify"

import bughouse from "./bughouse"
import routes from "./routes"

import App from "./components/app"

Vue.use(VueRouter)
Vue.use(Vuetify)

new Vue({
  el: '#app',
  router: new VueRouter({ routes }),
  render: (h) => h(App)
})

window.bughouse = bughouse()
