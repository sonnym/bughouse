import { UNIVERSE, GAME, LOGIN } from "~/share/constants/actions"
import { POSITION, RESULT } from "~/share/constants/game_update_types"

export default {
  actions: {
    [UNIVERSE]({ commit }, universe) {
      commit("universe", universe)
    },

    [GAME]: ({ commit }, game) => {
      commit("game", game)
    },

    [POSITION]: ({ commit }, positionData) => {
      commit("position", positionData)
    },

    [RESULT]: ({ commit }, resultData) => {
      commit("result", resultData)
    },

    [LOGIN]: ({ commit }, user) => {
      commit("login", user)
    },
  }
}
