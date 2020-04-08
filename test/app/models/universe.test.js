import test from "ava"

import { spy, stub } from "sinon"

import { v4 } from "uuid"
import { identity } from "ramda"

import Factory from "@/factory"

import { POSITION, RESULT } from "~/share/constants/game_update_types"

import Universe from "~/app/models/universe"
import User from "~/app/models/user"

test.before(async t => {
  const user = await User.create({
    email: `${v4()}@example.com`,
    password: v4(),
    displayName: v4()
  })

  const redis = Factory.redis()
  const send = identity
  const sendUniverse = identity

  t.context.socket = { uuid: v4(), send, sendUniverse, user, redis }
})

test("addSocket", async t => {
  const universe = new Universe()

  await universe.addSocket(t.context.socket)

  t.pass()
})

test("removeSocket", async t => {
  const universe = new Universe()

  await universe.addSocket(t.context.socket)
  universe.removeSocket(t.context.socket)

  t.pass()
})

test("registerClient: when lobby does not create a new game", async t => {
  const universe = new Universe()

  t.falsy(await universe.registerClient(stub()))
})

test("registerClient: when lobby creates a new game", async t => {
  const game = await Factory.game()

  const startGame = spy()
  const whiteClient = { startGame }
  const blackClient = { startGame }

  const lobby = { push: () => {
    return { game, whiteClient, blackClient }
  } }

  const universe = new Universe()

  await universe.registerClient(whiteClient)
  universe.lobby = lobby
  await universe.registerClient(blackClient)

  t.true(startGame.calledTwice)
})

test("nextGame: when not at tail", async t => {
  const games = await Factory.list(3)
  const game = await games.head()

  const universe = new Universe()
  universe.games = games

  t.is(await games.next(game), await universe.nextGame(game))
})

test("nextGame: when at tail", async t => {
  const games = await Factory.list(3)
  const game = await games.tail()

  const universe = new Universe()
  universe.games = games

  t.is(await games.head(), await universe.nextGame(game))
})

test("prevGame: when not at head", async t => {
  const games = await Factory.list(3)
  const game = await games.tail()

  const universe = new Universe()
  universe.games = games

  t.is(await games.prev(game), await universe.prevGame(game))
})

test("prevGame: when at head", async t => {
  const games = await Factory.list(3)
  const game = await games.head()

  const universe = new Universe()
  universe.games = games

  t.is(await games.tail(), await universe.prevGame(game))
})

test("serialize", async t => {
  const universe = new Universe()

  // when game is NaN, another test process flushed the db
  // TODO: inject redis dependency
  t.deepEqual({ users: 0, games: 0 }, await universe.serialize())
})

test("publishPosition: publishes to redis", t => {
  const publish = spy()
  const redis = { publish }

  const uuid = v4()
  const serializedPosition = v4()
  const position = { serialize: () => { return serializedPosition } }

  const universe = new Universe()
  universe.redis = redis

  universe.publishPosition(uuid, position)

  t.true(publish.calledOnceWith(uuid, JSON.stringify({
    type: POSITION,
    payload: serializedPosition
  })))
})

test("publishResult: publishes to redis", t => {
  const publish = spy()
  const redis = { publish }

  const uuid = v4()
  const result = v4()

  const universe = new Universe()
  universe.redis = redis

  universe.publishResult(uuid, result)

  t.true(publish.calledOnceWith(uuid, JSON.stringify({
    type: RESULT,
    payload: result
  })))
})