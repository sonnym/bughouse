import { Chess } from "chess.js"

import { find, includes, map, prop, propEq, uniq } from "ramda"

import { PLAY, MOVE, DROP } from "~/share/constants/actions"
import { PRIMARY } from "~/share/constants/role"

const chess = new Chess()

export default {
  namespaced: true,

  state: {
    waiting: false,
    playing: false,

    color: null
  },

  mutations: {
    waiting: state => state.waiting = true,

    start: (state, color) => {
      state.color = color

      state.waiting = false
      state.playing = true
    }
  },

  getters: {
    waiting: ({ waiting }) => (waiting),
    playing: ({ playing }) => (playing),

    color: ({ color }) => (color),

    moveable: (_state, _getters, _rootState, rootGetters) => coords => {
      const position = rootGetters["kibitzer/position"](PRIMARY)

      if (!position) {
        return () => { return false }
      }

      const fen = position.fen

      chess.load(fen)

      const moveable = uniq(
        map(prop("from"), chess.moves({ verbose: true }))
      )

      return includes(coords, moveable)
    },

    landable: (_state, _getters, _rootState, rootGetters) => (sourceCoords, coords) => {
      const position = rootGetters["kibitzer/position"](PRIMARY)

      if (!position) {
        return () => { return false }
      }

      const fen = position.fen

      chess.load(fen)

      const landable = map(
        prop("to"),
        chess.moves({ square: sourceCoords, verbose: true })
      )

      return includes(coords, landable)
    },
  },

  actions: {
    play({ commit, rootState }) {
      commit("waiting")

      rootState.send({ action: PLAY })
    },

    start({ commit, rootGetters }, game) {
      const color = find(propEq("uuid", rootGetters["uuid"]), game.players).color

      commit("start", color)
    },

    move({ rootState }, { from, to }) {
      rootState.send({ action: MOVE, from, to })
    },

    drop({ rootState }, { piece, square }) {
      rootState.send({ action: DROP, piece, square })
    }
  }
}
