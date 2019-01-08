import { isProduction } from "./../share/environment"

const store = {
  strict: !isProduction(),

  state: {
    universe: { },
    showNavigation: false,
    loggedIn: false
  },

  mutations: {
    hideNavigation: state => state.showNavigation = false,
    toggleNavigation: state => state.showNavigation = !state.showNavigation,

    logIn: state => state.loggedIn = true,
    logOut: state => state.loggedIn = false,

    universe: (state, universe) => state.universe = universe
  }
}

export default store
