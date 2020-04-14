import { find, propEq, reject, isNil, values } from "ramda"

import { isProduction } from "~/share/environment"

import { SUCCESS } from "~/share/constants/message"
import { BEFORE, AFTER } from "~/share/constants/role"
import { LEFT, RIGHT } from "~/share/constants/direction"
import { POSITION, RESULT } from "~/share/constants/game_update_types"
import { KIBITZ, ROTATE } from "~/share/constants/actions"

const store = {
  strict: !isProduction(),

  state: {
    send: () => { },
    fetch: () => { },

    universe: { },
    games: { },
    user: null,

    flip: false,
    rotating: false,
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

    hideNavigation: state => state.showNavigation = false,
    toggleNavigation: state => state.showNavigation = !state.showNavigation,

    login: (state, user) => state.user = user,
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

    [POSITION]: ({ games }, { uuid, position }) => {
      const game = find(propEq("uuid", uuid), reject(isNil, values(games)))

      if (isNil(game)) {
        return
      }

      game.currentPosition = position
    },

    [RESULT]: ({ games }, { uuid, result }) => { },

    [KIBITZ]: state => {
      // TODO: make action
      state.send({ action: KIBITZ })
    },

    rotateLeft: state => {
      if (state.rotating || isNil(state.games.after)) {
        return
      }

      state.rotating = true

      // TODO: make action
      state.send({
        action: ROTATE,
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
        action: ROTATE,
        direction: RIGHT,
        of: state.games.before.uuid
      })
    },

    message: (state, message) => {
      state.message = {
        show: true,
        ...message
      }
    }
  },

  actions: {
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
