import test from "ava"

import { fake, mock } from "sinon"

import { identity } from "ramda"

import Factory from "@/factory"

import Socket from "~/app/models/socket"

const universe = mock()

test("constructor sets a uuid", t => {
  const socket = new Socket(universe, { on: identity })
  t.truthy(socket.uuid)
})

test("send", async t => {
  const send = fake()
  const socket = new Socket(universe, { send, on: identity })

  await socket.send({ foo: "bar" })

  t.is('{"foo":"bar"}', send.lastCall.lastArg)
})

test("send when throws an error", t => {
  const send = () => { throw new Error() }
  const socket = new Socket(universe, { send, on: identity })

  t.throws(() => { socket.send({ foo: "bar" }) })
})

test.skip("connected", async t => {
  const socket = new Socket(universe, { send: identity, on: identity })

  await socket.connected()

  t.pass()
})

test("close", t => {
  const removeSocket = fake()
  const universe = { removeSocket }

  const socket = new Socket(universe, { on: () => {} })

  socket.close()

  t.pass()
})

test("message", async t => {
  const user = await Factory.user()
  const send = fake()

  const socket = new Socket(universe, { send, on: identity }, user)

  await socket.message(JSON.stringify({ action: "play" }))

  t.pass()
})
