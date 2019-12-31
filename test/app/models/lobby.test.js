import test from "ava"

import { fake, stub } from "sinon"

import Lobby from "~/app/models/lobby"

test("starts empty", t => {
  const lobby = new Lobby()

  t.is(0, lobby.clients.length)
})

test("accepts new clients", async t => {
  const lobby = new Lobby()

  const client = { uuid: 0 }

  t.false(await lobby.push(client))
  t.is(1, lobby.clients.length)
})

test("prevents client joining twice", async t => {
  const lobby = new Lobby()
  const client = { uuid: 0 }

  await lobby.push(client)

  t.false(await lobby.push(client))
  t.is(1, lobby.clients.length)
})

test("creates a new game", async t => {
  const create = fake.returns({
    serializePrepare: fake(),
    serialize: fake()
  })
  const Game = { create }

  const lobby = new Lobby(Game)

  const client1 = { uuid: 0, socket: stub() }
  const client2 = { uuid: 1, socket: stub() }

  await lobby.push(client1)
  const game = await lobby.push(client2)

  t.truthy(game)
  t.true(create.called)
  t.is(0, lobby.clients.length)
})
