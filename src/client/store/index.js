import { isProduction } from "~/share/environment"

import { BLACK } from "~/share/chess"

import actions from "./actions"
import authentication from "./authentication"

import kibitzer from "./kibitzer"
import player from "./player"

const store = {
  strict: !isProduction(),

  modules: {
    actions,
    authentication,

    kibitzer,
    player
  },

  state: {
    send: () => { },
    fetch: () => { },
    query: () => { },

    connected: false,

    universe: { },

    flip: false,
    showNavigation: false,

    message: {
      show: false,
      type: null,
      text: null
    }
  },

  mutations: {
    setSend: (state, send) => state.send = send,
    setFetch: (state, fetch) => state.fetch = fetch,
    setQuery: (state, query) => state.query = query,

    socketConnected: (state) => state.connected = true,
    socketDisconnected: (state) => state.connected = false,

    hideNavigation: state => state.showNavigation = false,
    toggleNavigation: state => state.showNavigation = !state.showNavigation,

    universe: (state, { universe }) => state.universe = universe,

    flip: (state) => state.flip = !state.flip,

    message: (state, message) => {
      state.message = {
        show: true,
        ...message
      }
    }
  },

  getters: {
    flip: (state, getters) => {
      if (getters["player/playing"] && getters["player/color"] === BLACK) {
        return true
      }

      return state.flip
    }
  },

  actions: {
    send({ state }, payload) {
      state.send(payload)
    }
  }
}

export default store
