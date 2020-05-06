import { find, propEq } from "ramda"

import { PLAY, MOVE } from "~/share/constants/actions"

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
    }
  }
}
