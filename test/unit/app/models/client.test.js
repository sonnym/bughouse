import test from "ava"
import sinon from "sinon"

import Client from "./../../../../src/app/models/client"

test("constructor sets a uuid", t => {
  const client = new Client()
  t.truthy(client.uuid)
})

test("send", t => {
  const send = sinon.fake()
  const client = new Client({ send })

  client.send({ foo: "bar" })

  t.is('{"foo":"bar"}', send.lastCall.lastArg)
})
