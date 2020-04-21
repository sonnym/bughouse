import test from "ava"

import { fake } from "sinon"

import Lobby from "~/app/models/lobby"

test("starts empty", t => {
  const lobby = new Lobby()

  t.is(0, lobby.users.length)
})

test("accepts new users", async t => {
  const lobby = new Lobby()

  const user = { get: () => { return 0 } }

  t.falsy(await lobby.push(user))
  t.is(1, lobby.users.length)
})

test("prevents user joining twice", async t => {
  const lobby = new Lobby()
  const user = { get: () => { return 0 } }

  await lobby.push(user)

  t.falsy(await lobby.push(user))
  t.is(1, lobby.users.length)
})

test("creates a new game", async t => {
  const create = fake.returns({
    serializePrepare: fake(),
    serialize: fake()
  })
  const Game = { create }

  const lobby = new Lobby(Game)

  const user1 = { get: () => { return 0 } }
  const user2 = { get: () => { return 1 } }

  await lobby.push(user1)
  const game = await lobby.push(user2)

  t.truthy(game)
  t.true(create.called)
  t.is(0, lobby.users.length)
})
