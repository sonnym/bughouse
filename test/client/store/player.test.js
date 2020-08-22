import test from "ava"

import { stub } from "sinon"
import { clone } from "ramda"

import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

import player from "~/client/store/player"

test("beginning state: neither waiting nor playing", t => {
  const store = new Vuex.Store(clone(player))

  t.false(store.state.waiting)
  t.false(store.state.playing)
})

test("waiting mutation: sets waiting to true", t => {
  const store = new Vuex.Store(clone(player))

  store.commit("waiting")

  t.true(store.state.waiting)
})

test("moveable getter", t => {
  const kibitzerStore = new Vuex.Store(clone(kibitzer))
  kibitzerStore.commit("game", { role: PRIMARY, game: {
    currentPosition: { fen: STARTING_POSITION }
  } })

  const store = clone(player)
  const moveable = store.getters["moveable"](null, null, null, kibitzerStore.getters)

  t.true(moveable("a2"))
  t.false(moveable("a1"))
})

test("waiting getter: returns the value of waiting", t => {
  const store = new Vuex.Store(clone(player))

  t.false(store.getters["waiting"])
})

test("play action: commits waiting, sends play action", t => {
  const commit = stub()

  const send = stub()
  const rootState = { send }

  player.actions.play({ commit, rootState })

  t.true(commit.calledOnceWith("waiting"))
  t.true(send.calledOnceWith({ action: "play" }))
})
