import test from "ava"

import { spy } from "sinon"

import { v4 } from "uuid"
import { identity } from "ramda"

import Factory from "@/factory"

import Universe, { GAME_CREATION_CHANNEL } from "~/app/models/universe"
import User from "~/app/models/user"

test("{add,remove}Socket", async t => {
  const user = await User.create({
    email: `${v4()}@example.com`,
    password: v4(),
    displayName: v4()
  })

  const redis = Factory.redis()
  const send = identity
  const sendUniverse = identity

  const client = { }

  const socket = { uuid: v4(), client, send, sendUniverse, user, redis }

  const universe = new Universe()

  await universe.addSocket(socket)
  await universe.removeSocket(socket)

  t.pass()
})

test("play: pushes user into lobby", async t => {
  const user = await Factory.user()
  const universe = new Universe()

  await universe.play(user)

  t.is(1, universe.lobby.length)
})

test("play: when lobby creates a new game", async t => {
  const users = [await Factory.user(), await Factory.user()]

  const universe = new Universe()

  await universe.play(users[0])
  await universe.play(users[1])

  t.is(0, universe.lobby.length)
})

test("serialize", async t => {
  const universe = new Universe()

  // when game is NaN, another test process flushed the db
  // TODO: inject redis dependency
  t.deepEqual({ users: 0, games: 0 }, await universe.serialize())
})

test("handleGameCreation: publishes message to channel", async t => {
  const universe = new Universe({ bind: false })

  const game = await Factory.game()
  await game.serializePrepare()

  const gamesPush = spy(universe.games, "push")
  const redisPublish = spy(universe.redis, "publish")
  const universePublish = spy(universe, "publish")

  await universe.handleGameCreation(game)

  t.true(gamesPush.calledOnceWith(game.get("uuid")))
  t.true(redisPublish.calledWithExactly(
    GAME_CREATION_CHANNEL,
    JSON.stringify(game.serialize())
  ))

  t.true(universePublish.calledOnce)
})

test.todo("handleRevisionCreation behavior")
