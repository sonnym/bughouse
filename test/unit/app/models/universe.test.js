import test from "ava"

import { v4 } from "uuid"
import { clone, includes, identity } from "ramda"

import Universe from "./../../../../src/app/models/universe"
import User from "./../../../../src/app/models/user"

test.before(async t => {
  const user = await User.createWithPassword({
    email: `${v4()}@example.com`,
    password: v4(),
    displayName: v4()
  })

  t.context.client = { uuid: v4(), send: identity, user }
  t.context.universe = clone(Universe).init()
})

test.serial("init", t => {
  t.log(t.context.universe)
  t.context.universe.init()
  t.deepEqual([], t.context.universe.clients)
})

test("addClient and removeClient", t => {
  t.context.universe.addClient(t.context.client)

  t.is(1, t.context.universe.clients.length)
  t.true(includes(t.context.client, t.context.universe.clients))
})

test("removeClient", t => {
  t.context.universe.addClient(t.context.client)
  t.context.universe.removeClient(t.context.client)

  t.is(0, t.context.universe.clients.length)
})

test("match when lobby is empty enqueues client", async t => {
  t.false(await t.context.universe.match(t.context.client))
  t.deepEqual(t.context.universe.lobby, t.context.client)
})

test("match when lobby has a client waiting", async t => {
  const user = await User.createWithPassword({
    email: `${v4()}@example.com`,
    password: v4(),
    displayName: v4()
  })

  t.context.universe.lobby = t.context.client

  t.false(await t.context.universe.match(t.context.client))
  t.truthy(await t.context.universe.match({ uuid: v4(), user }))
})

test("serialize", t => {
  t.deepEqual({ activeUsers: 0 }, t.context.universe.serialize())
})
