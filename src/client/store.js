import { isProduction } from "./../share/environment"

const store = {
  strict: !isProduction(),

  state: {
    universe: { },
    showNavigation: false,
    loggedIn: false,
    positions: [
      "nrkrbnqb/pppppppp/8/8/8/8/PPPPPPPP/NRKRBNQB w KQkq -",
      "qrbbnnkr/pppppppp/8/8/8/8/PPPPPPPP/QRBBNNKR w KQkq -",
      "brkbqnrn/pppppppp/8/8/8/8/PPPPPPPP/BRKBQNRN w KQkq -",
      "brknnbqr/pppppppp/8/8/8/8/PPPPPPPP/BRKNNBQR w KQkq -",
      "qnrnbbkr/pppppppp/8/8/8/8/PPPPPPPP/QNRNBBKR w KQkq -"
    ]
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
