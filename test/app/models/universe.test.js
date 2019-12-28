import test from "ava"

import { v4 } from "uuid"
import { identity } from "ramda"

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
})

test("addClient", async t => {
  const universe = new Universe()

  await universe.addClient(t.context.client)

  t.pass()
})

test("removeClient", async t => {
  const universe = new Universe()

  await universe.addClient(t.context.client)
  universe.removeClient(t.context.client)

  t.pass()
})

test("serialize", async t => {
  const universe = new Universe()

  t.deepEqual({ users: 0, games: 0 }, await universe.serialize())
})
