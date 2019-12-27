import test from "ava"

import { spy } from "sinon"

import Lobby from "~/app/models/lobby"

test("starts empty", t => {
  const lobby = new Lobby()

  t.is(0, lobby.players.length)
})

test("accepts new players", t => {
  const lobby = new Lobby()
  const player = { uuid: 0 }

  lobby.push(player)

  t.is(1, lobby.players.length)
})

test("prevents player joining twice", t => {
  const lobby = new Lobby()
  const player = { uuid: 0 }

  lobby.push(player)
  lobby.push(player)

  t.is(1, lobby.players.length)
})

test("creates a new game", async t => {
  const create = spy()
  const startGame = spy()

  const lobby = new Lobby({ create })

  const player1 = { uuid: 0, startGame }
  const player2 = { uuid: 1, startGame }

  await lobby.push(player1)
  await lobby.push(player2)

  t.true(create.called)

  t.is(2, startGame.callCount)
  t.is(0, lobby.players.length)
})
