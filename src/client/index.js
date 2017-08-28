import Vue from "vue"

import bughouse from './bughouse'

import App from "./components/app"

new Vue({
  el: '#app',
  render: (h) => h(App)
})

window.bughouse = bughouse()
