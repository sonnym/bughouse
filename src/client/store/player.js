import { find, includes, map, prop, propEq, uniq } from "ramda"

import { PLAY, MOVE, DROP } from "~/share/constants/actions"
import { PRIMARY } from "~/share/constants/role"

import Chess from "~/share/chess"

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
      const chess = new Chess(fen)

      const moveable = uniq(map(prop("from"), chess.moves))

      return includes(coords, moveable)
    },

    landable: (_state, _getters, _rootState, rootGetters) => (sourceCoords, coords) => {
      const position = rootGetters["kibitzer/position"](PRIMARY)

      if (!position) {
        return () => { return false }
      }

      const fen = position.fen
      const chess = new Chess(fen)

      const landable = map(
        prop("to"),
        chess.getMoves(sourceCoords)
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
