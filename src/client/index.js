import Vue from "vue"
import VueRouter from "vue-router"

import bughouse from './bughouse'
import routes from "./routes"

import App from "./components/app"

Vue.use(VueRouter)

new Vue({
  el: '#app',
  router: new VueRouter({ routes }),
  render: (h) => h(App)
})

window.bughouse = bughouse()
