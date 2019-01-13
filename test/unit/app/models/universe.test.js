import test from "ava"

import { v4 } from "uuid"
import { includes, identity } from "ramda"

import Universe from "./../../../../src/app/models/universe"

test.beforeEach(t=> {
  t.context.client = { uuid: v4(), send: identity }

  Universe.init() }
)

test.serial("init", t => {
  t.deepEqual([], Universe.clients)
})

test.serial("addClient", t => {
  Universe.addClient(t.context.client)

  t.true(includes(t.context.client, Universe.clients))
})

test.serial("removeClient", t => {
  Universe.addClient(t.context.client)
  t.is(1, Universe.clients.length)

  Universe.removeClient(t.context.client)
  t.is(0, Universe.clients.length)
})

test.serial("serialize", t => {
  t.deepEqual({ activeUsers: 0 }, Universe.serialize())
})
