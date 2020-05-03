import test from "ava"

import { spy } from "sinon"

import { v4 } from "uuid"

import { sample } from "@/core"

import { BEFORE, PRIMARY, AFTER } from "~/share/constants/role"
import { LEFT, RIGHT } from "~/share/constants/direction"

import store from "~/client/store/kibitzer"

test("game: when not rotating accepts new game", t => {
  const state = { rotating: false, games: { } }

  const role = sample([BEFORE, PRIMARY, AFTER])
  const game = { }

  store.mutations.game(state, { role, game })

  t.is(game, state.games[role])
})

test("game: when rotating and role is BEFORE", t => {
  const state = {
    rotating: true,
    games: {
      [BEFORE]: BEFORE,
      [PRIMARY]: PRIMARY,
      [AFTER]: AFTER
    }
  }

  const role = BEFORE
  const game = { }

  store.mutations.game(state, { role, game })

  t.deepEqual(
    state.games,
    {
      [BEFORE]: game,
      [PRIMARY]: BEFORE,
      [AFTER]: PRIMARY
    }
  )
})

test("game: when rotating and role is AFTER", t => {
  const state = {
    rotating: true,
    games: {
      [BEFORE]: BEFORE,
      [PRIMARY]: PRIMARY,
      [AFTER]: AFTER
    }
  }

  const role = AFTER
  const game = { }

  store.mutations.game(state, { role, game })

  t.deepEqual(
    state.games,
    {
      [BEFORE]: PRIMARY,
      [PRIMARY]: AFTER,
      [AFTER]: game
    }
  )
})

test("game: when rotating stops rotation and inverts", t => {
  const role = sample([BEFORE, PRIMARY, AFTER])
  const flip = sample([true, false])

  const state = { rotating: true, flip, games: {} }

  store.mutations.game(state, { role, game: { } })

  t.is(!flip, state.flip)
  t.false(state.rotating)
})

test("rotateLeft: when already rotating does nothing", t => {
  const commit = spy()
  const state = { rotating: true }

  store.actions.rotateLeft({ commit, state })

  t.true(commit.notCalled)
})

test("rotateLeft: when after game exists", t => {
  const after = { uuid: v4() }
  const games = { after }

  const commit = spy()
  const dispatch = spy()
  const state = { games }

  store.actions.rotateLeft({ commit, dispatch, state })

  t.true(commit.calledOnceWith("rotating"))

  t.true(dispatch.calledWithMatch("send", {
    action: "rotate",
    direction: LEFT,
    of: games.after.uuid
  }))
})

test("rotateRight: when already rotating does nothing", t => {
  const commit = spy()
  const state = { rotating: true }

  store.actions.rotateRight({ commit, state })

  t.true(commit.notCalled)
})

test("rotateRight: when before game exists", t => {
  const before = { uuid: v4() }
  const games = { before }

  const commit = spy()
  const dispatch = spy()
  const state = { games }

  store.actions.rotateRight({ state, dispatch, commit })

  t.true(commit.calledOnceWith("rotating"))

  t.true(dispatch.calledWithMatch("send", {
    action: "rotate",
    direction: RIGHT,
    of: games.before.uuid
  }))
})
