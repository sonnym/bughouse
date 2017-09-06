import Vue from "vue"
import VueRouter from "vue-router"

import bughouse from './bughouse'

import App from "./components/app"

import Games from "./components/games"
import Login from "./components/login"

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: "/", component: Games },
    { path: "/login", component: Login },

    { path: "*", redirect: { to: "/" } }
  ]
})

new Vue({
  el: '#app',
  router,
  render: (h) => h(App)
})

window.bughouse = bughouse()
