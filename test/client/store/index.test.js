import test from "ava"

import store from "~/client/store/index"

test("universe", t => {
  const state = { universe: null }

  const universe = { }
  const payload = { universe }

  store.mutations.universe(state, payload)

  t.is(universe, state.universe)
})

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
