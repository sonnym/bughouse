import test from "ava"

import { spy } from "sinon"

import Lobby from "~/app/models/lobby"

test("starts empty", t => {
  const lobby = new Lobby()

  t.is(0, lobby.players.length)
})

test("accepts new players", t => {
  const lobby = new Lobby()

  const client = { uuid: 0 }
  const player = { client }

  lobby.push(player)

  t.is(1, lobby.players.length)
})

test("prevents player joining twice", t => {
  const lobby = new Lobby()

  const client = { uuid: 0 }
  const player = { client }

  lobby.push(player)
  lobby.push(player)

  t.is(1, lobby.players.length)
})

test("creates a new game", async t => {
  const create = spy()
  const lobby = new Lobby({ create })

  const startGame = spy()

  const client1 = { uuid: 0 }
  const client2 = { uuid: 1 }
  const player1 = { client: client1, startGame }
  const player2 = { client: client2, startGame }

  await lobby.push(player1)
  await lobby.push(player2)

  t.true(create.called)

  t.is(2, startGame.callCount)
  t.is(0, lobby.players.length)
})
