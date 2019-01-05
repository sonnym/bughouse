import Vue from "vue"
import Vuex from "vuex"
import VueRouter from "vue-router"

import Vuetify, {
  VApp,
  VContainer,
  VDivider,
  VFooter,
  VIcon,
  VList,
  VListAction,
  VListItem,
  VListTile,
  VListTileAction,
  VListTileContent,
  VNavigationDrawer,
  VToolbar,
} from "vuetify/lib"

import "vuetify/src/stylus/app.styl"

import bughouse from "./bughouse"
import routes from "./routes"

import App from "./components/app"

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Vuetify, {
  components: {
    VApp,
    VContainer,
    VDivider,
    VFooter,
    VIcon,
    VList,
    VListAction,
    VListItem,
    VListTile,
    VListTileAction,
    VListTileContent,
    VNavigationDrawer,
    VToolbar
  }
})

const store = new Vuex.Store({})

new Vue({
  el: '#app',
  store,
  router: new VueRouter({ routes }),
  render: (h) => h(App)
})

window.bughouse = bughouse()
