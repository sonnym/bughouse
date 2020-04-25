import test from "ava"

import { spy } from "sinon"

import { v4 } from "uuid"
import { identity } from "ramda"

import Factory from "@/factory"

import { POSITION, RESULT } from "~/share/constants/game_update_types"

import Universe from "~/app/models/universe"
import User from "~/app/models/user"

// TODO: everything

test.before(async t => {
  const user = await User.create({
    email: `${v4()}@example.com`,
    password: v4(),
    displayName: v4()
  })

  const redis = Factory.redis()
  const send = identity
  const sendUniverse = identity

  const client = { }

  t.context.socket = { uuid: v4(), client, send, sendUniverse, user, redis }
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

test("play: when lobby does not create a new game", async t => {
  const user = await Factory.user()
  const universe = new Universe()

  t.falsy(await universe.play(user))
})

test("play: when lobby creates a new game", async t => {
  const users = [await Factory.user(), await Factory.user()]

  t.log(users)

  const universe = new Universe()
  const publishGameCreation = spy(universe, "publishGameCreation")

  await universe.play(users[0])
  await universe.play(users[1])

  t.true(publishGameCreation.calledOnce)
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

test("publishResult: removes from list and publishes to redis", t => {
  const remove = spy()
  const list = { remove }

  const publish = spy()
  const redis = { publish }

  const uuid = v4()
  const result = v4()

  const universe = new Universe()
  universe.list = list
  universe.redis = redis

  universe.publishResult(uuid, result)

  t.true(remove.calledOnceWith(uuid))

  t.true(publish.calledOnceWith(uuid, JSON.stringify({
    type: RESULT,
    payload: result
  })))
})
