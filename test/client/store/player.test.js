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

test("waitin mutation: sets waiting to true", t => {
  const store = new Vuex.Store(clone(player))

  store.commit("waiting")

  t.true(store.state.waiting)
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
