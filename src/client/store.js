import { find, propEq, reject, isNil, values } from "ramda"

import { isProduction } from "~/share/environment"

import { LEFT, RIGHT } from "~/share/constants/direction"

const store = {
  strict: !isProduction(),

  state: {
    send: () => { },

    universe: { },
    user: null,

    showNavigation: false,
    inverted: false,

    games: { },

    rotating: null
  },

  mutations: {
    setSend: (state, send) => state.send = send,

    hideNavigation: state => state.showNavigation = false,
    toggleNavigation: state => state.showNavigation = !state.showNavigation,

    login: (state, { user }) => state.user = user,
    logout: state => state.user = null,

    universe: (state, { universe }) => state.universe = universe,
    game: (state, { role, game }) => state.games = { [role]: game, ...state.games },

    position: ({ games }, { uuid, fen }) => {
      const game = find(propEq("uuid", uuid), reject(isNil, values(games)))

      if (isNil(game)) {
        return
      }

      game.positions.push({ fen })
    },

    kibitz: state => {
      // TODO: make action
      state.send({ action: "kibitz" })
    },

    rotateLeft: state => {
      if (state.rotating || isNil(state.games.after)) {
        return
      }

      state.rotating = true

      // TODO: make action
      state.send({
        action: "rotate",
        direction: LEFT,
        of: state.games.after.uuid
      })
    },

    rotateRight: state => {
      if (state.rotating || isNil(state.games.before)) {
        return
      }

      state.rotating = true

      // TODO: make action
      state.send({
        action: "rotate",
        direction: RIGHT,
        of: state.games.before.uuid
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
