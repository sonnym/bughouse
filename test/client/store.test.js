import test from "ava"

import { spy } from "sinon"

import { identity } from "ramda"
import { v4 } from "uuid"

import { LEFT, RIGHT } from "~/share/constants/direction"

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

test("rotateLeft: when already rotating does nothing", t => {
  const send = spy()
  const state = { send, rotating: true }

  store.mutations.rotateLeft(state)

  t.true(send.notCalled)
})

test("rotateLeft: when after game exists", t => {
  const send = spy()
  const after = { uuid: v4() }
  const games = { after }

  const state = { send, games }

  store.mutations.rotateLeft(state)

  t.true(state.rotating)

  t.true(send.calledOnce)
  t.true(send.calledWithMatch({
    action: "rotate",
    direction: LEFT,
    of: games.after.uuid
  }))
})

test("rotateRight: when already rotating does nothing", t => {
  const send = spy()
  const state = { send, rotating: true }

  store.mutations.rotateRight(state)

  t.true(send.notCalled)
})

test("rotateRight: when before game exists", t => {
  const send = spy()
  const before = { uuid: v4() }
  const games = { before }

  const state = { send, games }

  store.mutations.rotateRight(state)

  t.true(state.rotating)

  t.true(send.calledOnce)
  t.true(send.calledWithMatch({
    action: "rotate",
    direction: RIGHT,
    of: games.before.uuid
  }))
})

test("actions: logout", async t => {
  global.fetch = identity
  store.actions.logout({ commit: identity })
  t.pass()
})
