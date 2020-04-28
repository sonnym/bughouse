import { isProduction } from "~/share/environment"

import { SUCCESS } from "~/share/constants/message"

import kibitzer from "./kibitzer"

const store = {
  strict: !isProduction(),

  modules: {
    kibitzer
  },

  state: {
    send: () => { },
    fetch: () => { },
    query: () => { },

    connected: false,

    universe: { },
    user: null,

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

    login: (state, user) => state.user = user,
    logout: state => state.user = null,

    universe: (state, { universe }) => state.universe = universe,

    flip: (state) => state.flip = !state.flip,

    message: (state, message) => {
      state.message = {
        show: true,
        ...message
      }
    }
  },

  actions: {
    send({ state }, payload) {
      state.send(payload)
    },

    async logout({ commit, state }) {
      commit("hideNavigation")

      const response = await state.fetch("/sessions", { method: "DELETE" })

      if (response.status === 205) {
        commit("message", {
          type: SUCCESS,
          text: "Successfully logged out!"
        })

        commit("logout")
      }
    }
  }
}

export default store
