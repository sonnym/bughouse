import test from "ava"

import { v4 } from "uuid"
import { includes } from "ramda"

import Universe from "./../../../../src/app/models/universe"

test.beforeEach(() => { Universe.init() })

test.serial("init", t => {
  t.deepEqual([], Universe.clients)
})

test.serial("addClient", t => {
  const client = { }
  Universe.addClient(client)

  t.true(includes(client, Universe.clients))
})

test.serial("removeClient", t => {
  const client = { uuid: v4() }

  Universe.addClient(client)
  t.is(1, Universe.clients.length)

  Universe.removeClient(client)
  t.is(0, Universe.clients.length)
})

test.serial("serialize", t => {
  t.deepEqual({ activeUsers: 0 }, Universe.serialize())
})
