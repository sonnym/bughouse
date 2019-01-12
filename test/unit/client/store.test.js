import test from "ava"

import store from "./../../../src/client/store"

test("hideNavigation", t => {
  const state = { showNavigation: true }
  store.mutations.hideNavigation(state)
  t.false(state.showNavigation)
})

test("toggleNavigation", t => {
  const state = { showNavigation: true }

  store.mutations.toggleNavigation(state)
  t.false(state.showNavigation)

  store.mutations.toggleNavigation(state)
  t.true(state.showNavigation)
})

test("logIn", t => {
  const state = { loggedIn: false }
  store.mutations.logIn(state)
  t.true(state.loggedIn)
})

test("logOut", t => {
  const state = { loggedIn: true }
  store.mutations.logOut(state)
  t.false(state.loggedIn)
})

test("universe", t => {
  const state = { universe: null }
  const universe = { }

  store.mutations.universe(state, universe)

  t.is(universe, state.universe)
})

test.todo("rotateLeft")
test.todo("rotateRight")
