import { isProduction } from "./../share/environment"

const store = {
  strict: !isProduction(),

  state: {
    showNavigation: false,
    loggedIn: false
  },

  mutations: {
    hideNavigation: state => state.showNavigation = false,
    toggleNavigation: state => state.showNavigation = !state.showNavigation,

    logIn: state => state.loggedIn = true,
    logOut: state => state.loggedIn = false,
  }
}

export default store
