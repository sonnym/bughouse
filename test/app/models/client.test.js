import test from "ava"

import { fake, mock } from "sinon"

import { identity } from "ramda"

import Factory from "@/factory"

import Client from "~/app/models/client"

const universe = mock()

test("constructor sets a uuid", t => {
  const client = new Client(universe, { on: () => {} })
  t.truthy(client.uuid)
})

test("send", async t => {
  const send = fake()
  const client = new Client(universe, { send, on: () => {} })

  await client.send({ foo: "bar" })

  t.is('{"foo":"bar"}', send.lastCall.lastArg)
})

test("send when throws an error", t => {
  const client = new Client(universe, { send: () => { throw {} }, on: () => {} })

  client.send({ foo: "bar" })

  t.pass()
})

test.skip("connected", async t => {
  const client = new Client(universe, { send: identity, on: identity })

  await client.connected()

  t.pass()
})

test("close", t => {
  const removeClient = fake()
  const universe = { removeClient }

  const client = new Client(universe, { on: () => {} })

  client.close()

  t.pass()
})

test("message", async t => {
  const user = await Factory.user()
  const send = fake()

  const client = new Client(universe, { send, on: identity }, user)

  await client.message(JSON.stringify({ action: "play" }))

  t.pass()
})
