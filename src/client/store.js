import { isProduction } from "./../share/environment"

const store = {
  strict: !isProduction(),

  state: {
    universe: { },
    user: null,

    showNavigation: false,

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

    logIn: (state, user) => state.user = user,
    logOut: state => state.user = null,

    universe: (state, universe) => state.universe = universe,

    rotateLeft: state => state.positions.unshift(state.positions.pop()),
    rotateRight: state => state.positions.push(state.positions.shift())
  }
}

export default store
