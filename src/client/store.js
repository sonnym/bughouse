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

    games: { },
    rotation: null
  },

  mutations: {
    setSend: (state, send) => state.send = send,

    hideNavigation: state => state.showNavigation = false,
    toggleNavigation: state => state.showNavigation = !state.showNavigation,

    login: (state, user) => state.user = user,
    logout: state => state.user = null,

    universe: (state, universe) => state.universe = universe,
    games: (state, games) => state.games = games,

    position: ({ games }, { uuid, fen }) => {
      const game = find(propEq("uuid", uuid), reject(isNil, values(games)))

      game.currentPosition.fen = fen
    },

    kibitz: state => {
      state.send({ action: "kibitz" })
    },

    rotateLeft: state => {
      if (isNil(state.games.after)) {
        return
      }

      state.send({
        action: "subscribe",
        spec: {
          direction: "after",
          of: state.games.after.uuid
        }
      })
    },

    rotateRight: state => {
      if (isNil(state.games.before)) {
        return
      }

      state.send({
        action: "subscribe",
        spec: {
          direction: "before",
          of: state.games.before.uuid
        }
      })
    }
  },

  actions: {
    async logout({ commit }) {
      commit("hideNavigation")

      const response = await fetch("/sessions", { method: "DELETE" })

      if (response.status === 205) {
        commit("logout")
      }
    }
  }
}

export default store
