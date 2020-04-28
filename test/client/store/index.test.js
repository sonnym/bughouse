import test from "ava"

import { identity } from "ramda"

import store from "~/client/store/index"

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

test("login", t => {
  const state = { user: null }

  const user = { }

  store.mutations.login(state, user)

  t.is(user, state.user)
})

test("logout", t => {
  const state = { user: { } }
  store.mutations.logout(state)
  t.falsy(state.user)
})

test("universe", t => {
  const state = { universe: null }

  const universe = { }
  const payload = { universe }

  store.mutations.universe(state, payload)

  t.is(universe, state.universe)
})

test("actions: logout", async t => {
  const commit = identity
  const state = { fetch: identity }

  store.actions.logout({ commit, state })

  t.pass()
})
