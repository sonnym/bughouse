import test from "ava"
import sinon from "sinon"

import Factory from "./../../helpers/factory"

import Universe from "./../../../src/app/models/universe"
import Client from "./../../../src/app/models/client"

Universe.init()

test("constructor sets a uuid", t => {
  const client = new Client({ on: () => {} })
  t.truthy(client.uuid)
})

test("send", async t => {
  const send = sinon.fake()
  const client = new Client({ send, on: () => {} })

  await client.send({ foo: "bar" })

  t.is('{"foo":"bar"}', send.lastCall.lastArg)
})

test("send when throws an error", t => {
  const client = new Client({ send: () => { throw {} }, on: () => {} })

  client.send({ foo: "bar" })

  t.pass()
})

test("connected", t => {
  const client = new Client({ on: () => {} })

  client.connected()

  t.pass()
})

test("close", t => {
  const client = new Client({ on: () => {} })

  client.close()

  t.pass()
})

test("message", async t => {
  const send = sinon.fake()
  const client = new Client({ send, on: () => {} })

  client.user = await Factory.user()

  await client.message(JSON.stringify({ action: "play" }))

  t.pass()
})
