import test from "ava"

import store from "./../../../src/client/store"

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
