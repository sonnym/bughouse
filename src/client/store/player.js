import { PLAY, MOVE } from "~/share/constants/actions"

export default {
  namespaced: true,

  state: {
    waiting: false,
    playing: false
  },

  mutations: {
    waiting: state => state.waiting = true
  },

  getters: {
    waiting: ({ waiting }) => (waiting)
  },

  actions: {
    play({ commit, rootState }) {
      commit("waiting")

      rootState.send({ action: PLAY })
    },

    move({ rootState }, { from, to }) {
      rootState.send({ action: MOVE, from, to })
    }
  }
}
