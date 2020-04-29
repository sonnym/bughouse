import test from "ava"

import { stub} from "sinon"

import { v4 } from "uuid"
import { clone } from "ramda"

import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

import authentication from "~/client/store/authentication"

test("loggedIn getter: false when user is not set", t => {
  const store = new Vuex.Store(clone(authentication))

  t.false(store.getters["loggedIn"])
})

test("loggedIn getter: true when user is set", t => {
  const store = new Vuex.Store(clone(authentication))
  store.commit("login", { })

  t.true(store.getters["loggedIn"])
})

test("loggedOut getter: true when user is not set", t => {
  const store = new Vuex.Store(clone(authentication))

  t.true(store.getters["loggedOut"])
})

test("loggedOut getter: false when user is set", t => {
  const store = new Vuex.Store(clone(authentication))
  store.commit("login", { })

  t.false(store.getters["loggedOut"])
})

test("displayName getter", t => {
  const displayName = v4()

  const store = new Vuex.Store(clone(authentication))
  t.is("Bughouse", store.getters["displayName"])

  store.commit("login", { displayName })
  t.is(displayName, store.getters["displayName"])
})

test("uuid getter", t => {
  const uuid = v4()

  const store = new Vuex.Store(clone(authentication))
  t.is(null, store.getters["uuid"])

  store.commit("login", { uuid })
  t.is(uuid, store.getters["uuid"])
})

test("login mutation: stores the user object", t => {
  const store = clone(authentication)

  const state = { user: null }
  const user = v4()

  store.mutations.login(state, user)

  t.is(user, state.user)
})

test("logout mutation: unsets user", t => {
  const store = clone(authentication)
  const state = { user: { } }

  store.mutations.logout(state)

  t.is(null, state.user)
})

test("logout action", async t => {
  const store = clone(authentication)

  const commit = stub()

  const fetch = () => ({ status: 205 })
  const rootState = { fetch }

  await store.actions.logout({ commit, rootState })

  t.true(commit.calledThrice)
})
