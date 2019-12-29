import test from "ava"

import { fake, spy } from "sinon"

import Lobby from "~/app/models/lobby"

test("starts empty", t => {
  const lobby = new Lobby()

  t.is(0, lobby.clients.length)
})

test("accepts new clients", t => {
  const lobby = new Lobby()

  const socket = { uuid: 0 }
  const client = { socket }

  lobby.push(client)

  t.is(1, lobby.clients.length)
})

test("prevents client joining twice", t => {
  const lobby = new Lobby()

  const socket = { uuid: 0 }
  const client = { socket }

  lobby.push(client)
  lobby.push(client)

  t.is(1, lobby.clients.length)
})

test("creates a new game", async t => {
  const create = fake.returns({ serialize: fake() })
  const lobby = new Lobby({ create })

  const startGame = spy()

  const socket1 = { uuid: 0 }
  const socket2 = { uuid: 1 }
  const client1 = { socket: socket1, startGame }
  const client2 = { socket: socket2, startGame }

  await lobby.push(client1)
  await lobby.push(client2)

  t.true(create.called)

  t.is(2, startGame.callCount)
  t.is(0, lobby.clients.length)
})
