import { isProduction } from "./../share/environment"

const store = {
  strict: !isProduction(),

  state: {
    loggedIn: false
  },

  mutations: {
    logIn: state => state.loggedIn = true,
    logOut: state => state.loggedIn = false,
  }
}

export default store
