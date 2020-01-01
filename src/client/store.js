import { find, propEq, reject, isNil, values } from "ramda"

import { isProduction } from "~/share/environment"

import { BEFORE, AFTER } from "~/share/constants/role"
import { LEFT, RIGHT } from "~/share/constants/direction"

const store = {
  strict: !isProduction(),

  state: {
    send: () => { },

    universe: { },
    games: { },
    user: null,

    flip: false,
    rotating: false,
    showNavigation: false,
  },

  mutations: {
    setSend: (state, send) => state.send = send,

    hideNavigation: state => state.showNavigation = false,
    toggleNavigation: state => state.showNavigation = !state.showNavigation,

    login: (state, { user }) => state.user = user,
    logout: state => state.user = null,

    universe: (state, { universe }) => state.universe = universe,

    flip: (state) => state.flip = !state.flip,

    game: (state, { role, game }) => {
      if (state.rotating) {
        if (role === BEFORE) {
          state.games = {
            before: game,
            primary: state.games.before,
            after: state.games.primary
          }

        } else if (role === AFTER) {
          state.games = {
            before: state.games.primary,
            primary: state.games.after,
            after: game
          }
        }

        state.rotating = false
        state.flip = !state.flip

      } else {
        state.games = { [role]: game, ...state.games }
      }
    },

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
