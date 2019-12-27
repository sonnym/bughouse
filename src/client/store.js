import { find, propEq, reject, isNil, values } from "ramda"

import { isProduction } from "~/share/environment"

const store = {
  strict: !isProduction(),

  state: {
    send: () => { },

    universe: { },
    user: null,

    showNavigation: false,
    inverted: false,

    games: { }
  },

  mutations: {
    setSend: (state, send) => state.send = send,

    hideNavigation: state => state.showNavigation = false,
    toggleNavigation: state => state.showNavigation = !state.showNavigation,

    logIn: (state, user) => state.user = user,
    logOut: state => state.user = null,

    universe: (state, universe) => state.universe = universe,
    games: (state, games) => state.games = games,

    position: ({ games }, { uuid, fen }) => {
      const game = find(propEq("uuid", uuid), reject(isNil, values(games)))

      game.currentPosition.fen = fen
    },

    rotateLeft: state => state.positions.unshift(state.positions.pop()),
    rotateRight: state => state.positions.push(state.positions.shift())
  },

  actions: {
    async logout({ commit }) {
      commit("hideNavigation")

      const response = await fetch("/sessions", { method: "DELETE" })

      if (response.status === 205) {
        commit("logOut")
      }
    }
  }
}

export default store
