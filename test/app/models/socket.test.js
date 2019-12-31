import test from "ava"

import { fake } from "sinon"

import Factory from "@/factory"

import Socket from "~/app/models/socket"

const universe = { }
const websocket = { on: fake(), send: fake() }

test("send", async t => {
  const send = fake()
  const socket = new Socket(universe, { ...websocket, send })

  await socket.send({ foo: "bar" })

  t.is('{"foo":"bar"}', send.lastCall.lastArg)
})

test("send when throws an error", t => {
  const send = () => { throw new Error() }
  const socket = new Socket(universe, { ...websocket, send })

  t.notThrows(() => { socket.send({ foo: "bar" }) })
})

test("connected", async t => {
  const games = { length: () => { return 0 } }

  const addSocket = fake()
  const universe = { addSocket, games}

  const socket = new Socket(universe, websocket)

  await socket.connected()

  t.true(addSocket.calledOnce)
})

test("close", t => {
  const removeSocket = fake()
  const universe = { removeSocket }

  const socket = new Socket(universe, websocket)

  socket.close()

  t.pass()
})

test("message", async t => {
  // TODO: remove universe implementation details
  const registerClient = fake()
  const universe = { registerClient }

  const user = await Factory.user()
  const send = fake()

  const socket = new Socket(universe, { ...websocket, send }, user)

  await socket.message(JSON.stringify({ action: "play" }))

  t.pass()
})
