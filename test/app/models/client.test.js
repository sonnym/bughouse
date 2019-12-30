import test from "ava"

import { spy } from "sinon"
import { v4 } from "uuid"

import { identity } from "ramda"

import Factory from "@/factory"
import { REVISION_TYPES } from "~/share/constants"

import Universe from "~/app/models/universe"
import List from "~/app/models/list"

import Client from "~/app/models/client"

test("constructor: sets a uuid", t => {
  const client = new Client()

  t.truthy(client.uuid)
})

test("constructor: creates a redis client", t => {
  const client = new Client()

  t.truthy(client.redis)
})

// senders

test("sendGame: when null game", async t => {
  const client = new Client()

  t.falsy(await client.sendGame(null))
})

test("sendGame: when actual game", async t => {
  const send = spy()
  const socket = { send }

  const client = new Client({}, socket)

  const serialize = spy()
  const game = { serialize }

  await client.sendGame(game)

  t.true(serialize.calledOnce)
  t.true(send.calledOnce)
})

// subscribers

// actions

test("kibitz: when no games", async t => {
  const client = new Client(new Universe())

  t.falsy(await client.kibitz())
})

test("kibitz: when games", async t => {
  const redis = { on: identity, subscribeAsync: identity }
  const socket = { redis, send: identity }

  const list = new List(v4())
  const games = [
    await Factory.game(),
    await Factory.game(),
    await Factory.game()
  ]

  for (const i in games) {
    await list.push(await games[i].get("uuid"))
  }
  t.is(3, await list.length())

  const universe = { games: list }
  const client = new Client(universe, socket)

  const subscribeGame = spy(client, "sendGame")
  await client.kibitz()

  t.is(subscribeGame.firstCall.args[0].get("uuid"), games[0].get("uuid"))
  t.is(subscribeGame.firstCall.args[1], "before")

  t.is(subscribeGame.secondCall.args[0].get("uuid"), games[1].get("uuid"))
  t.is(subscribeGame.secondCall.args[1], "primary")

  t.is(subscribeGame.thirdCall.args[0].get("uuid"), games[2].get("uuid"))
  t.is(subscribeGame.thirdCall.args[1], "after")
})

test("play: registers client with universe", async t => {
  const registerClient = spy()
  const universe = { registerClient }

  const client = new Client(universe)

  client.play()

  t.is(1, registerClient.callCount)
})

test("revision: when no gameUUID", async t => {
  const client = new Client()
  const revision = await client.revision()

  t.falsy(revision)
})

test("revision: when gameUUID, creates revision and publishes position", async t => {
  const publishPosition = spy()
  const universe = { publishPosition }

  const game = await Factory.game()

  const client = new Client(universe)
  client.gameUUID = game.get("uuid")

  await client.revision({
    type: REVISION_TYPES.MOVE,
    from: "e2",
    to: "e4"
  })

  t.true(publishPosition.calledOnce)
})
