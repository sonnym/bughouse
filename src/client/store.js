import { isProduction } from "~/share/environment"

import { find, propEq, reject, isNil, values } from "ramda"

const store = {
  strict: !isProduction(),

  state: {
    universe: { },
    user: null,

    showNavigation: false,

    games: []
  },

  mutations: {
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
