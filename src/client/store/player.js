import { PLAY, MOVE } from "~/share/constants/actions"

export default {
  namespaced: true,

  state: {
    waiting: false,
    playing: false
  },

  mutations: {
    waiting: state => state.waiting = true,

    start: state => {
      state.waiting = false
      state.playing = true
    }
  },

  getters: {
    waiting: ({ waiting }) => (waiting)
  },

  actions: {
    play({ commit, rootState }) {
      commit("waiting")

      rootState.send({ action: PLAY })
    },

    start({ commit }) {
      commit("start")
    },

    move({ rootState }, { from, to }) {
      rootState.send({ action: MOVE, from, to })
    }
  }
}
