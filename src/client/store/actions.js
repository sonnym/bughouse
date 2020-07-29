import { UNIVERSE, GAME, REVISION, LOGIN, START } from "~/share/constants/actions"

export default {
  actions: {
    [UNIVERSE]({ commit }, universe) {
      commit("universe", universe)
    },

    [GAME]: ({ commit }, game) => {
      commit("game", game)
    },

    [REVISION]: ({ commit }, serializedRevision) => {
      commit("revision", serializedRevision)
    },

    [LOGIN]: ({ commit }, user) => {
      commit("login", user)
    },

    [START]: ({ dispatch }, { game }) => {
      dispatch("player/start", game)
    }
  }
}
