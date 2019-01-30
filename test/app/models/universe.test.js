import test from "ava"

import { v4 } from "uuid"
import { clone, identity } from "ramda"

import Factory from "./../../helpers/factory"

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

  t.context.client = { uuid: v4(), send, sendUniverse, user, redis }
  t.context.universe = await clone(Universe).init()
})

test.serial("init", t => {
  t.context.universe.init()

  t.is(t.context.universe.lobby, null)
})

test.serial("addClient", t => {
  t.context.universe.addClient(t.context.client)
  t.is(t.context.universe.lobby, null)
})

test.serial("removeClient", t => {
  t.context.universe.lobby = t.context.client

  t.context.universe.removeClient(t.context.client)

  t.is(t.context.universe.lobby, null)
})

test.serial("match when lobby is empty enqueues client", async t => {
  t.false(await t.context.universe.match(t.context.client))
  t.deepEqual(t.context.universe.lobby, t.context.client)
})

test.serial("match when lobby has a client waiting", async t => {
  const user = await User.create({
    email: `${v4()}@example.com`,
    password: v4(),
    displayName: v4()
  })

  t.context.universe.lobby = t.context.client

  t.false(await t.context.universe.match(t.context.client))
  t.truthy(await t.context.universe.match({ uuid: v4(), user }))
})

test.serial("serialize", async t => {
  t.deepEqual({ users: 0, games: 0 }, await t.context.universe.serialize())
})
