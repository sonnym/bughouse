import test from "ava"

import { identity } from "ramda"

import store from "~/client/store/authentication"

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

test("actions: logout", async t => {
  const commit = identity
  const rootState = { fetch: identity }

  store.actions.logout({ commit, rootState })

  t.pass()
})
