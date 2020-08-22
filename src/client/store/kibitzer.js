import { contains, find, propEq, reject, isNil, values } from "ramda"

import { BEFORE, PRIMARY, AFTER } from "~/share/constants/role"
import { LEFT, RIGHT } from "~/share/constants/direction"

import { ROTATE } from "~/share/constants/actions"
import { MOVE, DROP, RESERVE } from "~/share/constants/revision_types"

export default {
  namespaced: true,

  state: {
    games: {
      [BEFORE]: { },
      [PRIMARY]: { },
      [AFTER]: { }
    },

    rotating: false
  },

  getters: {
    games: state => (state.games),
    position: state => role => (state.games[role].currentPosition)
  },

  mutations: {
    game: (state, { role, game }) => {
      if (!state.rotating) {
        state.games = { ...state.games, [role]: game }
        return
      }

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
    },

    revision: (state, { uuid: gameUUID, revision }) => {
      const game = find(propEq("uuid", gameUUID), reject(isNil, values(state.games)))

      if (isNil(game)) {
        return
      }

      if (contains(revision.type, [MOVE, DROP, RESERVE])) {
        game.currentPosition = revision.position
      }

      // TODO: handle all revision types
    },

    rotating: state => state.rotating = true
  },

  actions: {
    rotateLeft: ({ state, commit, dispatch }) => {
      if (state.rotating || isNil(state.games.after)) {
        return
      }

      commit("rotating")

      dispatch("send", {
        action: ROTATE,
        direction: LEFT,
        of: state.games.after.uuid
      })
    },

    rotateRight: ({ state, commit, dispatch }) => {
      if (state.rotating || isNil(state.games.before)) {
        return
      }

      commit("rotating")

      dispatch("send", {
        action: ROTATE,
        direction: RIGHT,
        of: state.games.before.uuid
      })
    }
  }
}
