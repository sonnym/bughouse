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
  const state = { user: null }
  store.mutations.logIn(state, { })
  t.truthy(state.user)
})

test("logOut", t => {
  const state = { user: { } }
  store.mutations.logOut(state)
  t.falsy(state.user)
})

test("universe", t => {
  const state = { universe: null }
  const universe = { }

  store.mutations.universe(state, universe)

  t.is(universe, state.universe)
})

test.todo("rotateLeft")
test.todo("rotateRight")
