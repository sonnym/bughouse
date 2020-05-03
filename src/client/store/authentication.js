import { SUCCESS } from "~/share/constants/message"

export default {
  state: {
    user: null,
  },

  getters: {
    loggedIn: (state) => {
      return state.user !== null
    },

    loggedOut: (state) => {
      return state.user === null
    },

    displayName: (state, getters) => {
      return getters["loggedIn"] ? state.user.displayName : "Bughouse"
    },

    uuid: (state, getters) => {
      return getters["loggedIn"] ? state.user.uuid : null
    }
  },

  mutations: {
    login: (state, user) => state.user = user,
    logout: state => state.user = null,
  },

  actions: {
    async logout({ commit, rootState }) {
      commit("hideNavigation")

      const response = await rootState.fetch("/sessions", { method: "DELETE" })

      if (response.status === 205) {
        commit("message", {
          type: SUCCESS,
          text: "Successfully logged out!"
        })

        commit("logout")
      }
    }
  }
}
