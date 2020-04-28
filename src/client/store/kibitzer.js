import { find, propEq, reject, isNil, values } from "ramda"

import { BEFORE, AFTER } from "~/share/constants/role"
import { LEFT, RIGHT } from "~/share/constants/direction"
import { POSITION, RESULT } from "~/share/constants/game_update_types"
import { ROTATE } from "~/share/constants/actions"

export default {
  state: {
    games: { },
    rotating: false
  },

  getters: {
    games: state => {
      return state.games
    }
  },

  mutations: {
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
