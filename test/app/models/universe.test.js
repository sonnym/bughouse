import test from "ava"

import { v4 } from "uuid"
import { clone, identity } from "ramda"

import Factory from "@/factory"

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

test.serial("addClient", t => {
  t.context.universe.addClient(t.context.client)
  t.truthy(t.context.universe.lobby)
})

test.serial("removeClient", t => {
  t.context.universe.removeClient(t.context.client)
})

test.serial("serialize", async t => {
  t.deepEqual({ users: 0, games: 0 }, await t.context.universe.serialize())
})
