import { UNIVERSE, GAME, REVISION, LOGIN, START } from "~/share/constants/actions"

export default {
  actions: {
    [UNIVERSE]({ commit }, universe) {
      commit("universe", universe)
    },

    [GAME]: ({ commit }, gameData) => {
      commit("kibitzer/game", gameData)
    },

    [REVISION]: ({ commit }, serializedRevision) => {
      commit("kibitzer/revision", serializedRevision)
    },

    [LOGIN]: ({ commit }, user) => {
      commit("login", user)
    },

    [START]: ({ dispatch }, { game }) => {
      dispatch("player/start", game)
    }
  }
}
