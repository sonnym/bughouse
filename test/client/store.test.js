import test from "ava"

import { spy } from "sinon"

import { identity } from "ramda"
import { v4 } from "uuid"

import store from "~/client/store"

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
  const payload = { user }

  store.mutations.login(state, payload)

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

test("logout action", async t => {
  global.fetch = identity
  store.actions.logout({ commit: identity })
  t.pass()
})

test("rotateLeft", t => {
  const send = spy()
  const after = { uuid: v4() }
  const games = { after }

  const state = { send, games }

  store.mutations.rotateLeft(state)

  t.true(send.calledOnce)
  t.true(send.calledWithMatch({
    action: "subscribe",
    spec: {
      direction: "after",
      of: games.after.uuid
    }
  }))
})

test("rotateRight", t => {
  const send = spy()
  const before = { uuid: v4() }
  const games = { before }

  const state = { send, games }

  store.mutations.rotateRight(state)

  t.true(send.calledOnce)
  t.true(send.calledWithMatch({
    action: "subscribe",
    spec: {
      direction: "before",
      of: games.before.uuid
    }
  }))
})
