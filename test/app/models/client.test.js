import test from "ava"

import { fake, spy } from "sinon"
import { v4 } from "uuid"

import { identity } from "ramda"

import Factory from "@/factory"

import Universe from "~/app/models/universe"
import List from "~/app/models/list"

import Client from "~/app/models/client"

const redis = { on: fake() }

test("play", async t => {
  const play = spy()
  const universe = { play }

  const socket = { redis }

  const client = new Client(universe, socket)

  client.play()

  t.is(1, play.callCount)
})

test("revision", async t => {
  const send = fake()
  const socket = { send, redis }

  const game = await Factory.game()

  const client = new Client(null, socket)
  client.serializedGame = await game.serialize()

  await client.revision({ type: "move" })

  t.pass()
})

test("subscribeGames: when no games", async t => {
  const socket = { redis }

  const client = new Client(new Universe(), socket)

  t.falsy(await client.subscribeGames())
})

test("subscribeGames: when games", async t => {
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

  const subscribeGame = spy(client, "subscribeGame")
  await client.subscribeGames()

  t.is(subscribeGame.firstCall.args[0].get("uuid"), games[0].get("uuid"))
  t.is(subscribeGame.firstCall.args[1], "before")

  t.is(subscribeGame.secondCall.args[0].get("uuid"), games[1].get("uuid"))
  t.is(subscribeGame.secondCall.args[1], "primary")

  t.is(subscribeGame.thirdCall.args[0].get("uuid"), games[2].get("uuid"))
  t.is(subscribeGame.thirdCall.args[1], "after")
})

test("subscribeGame: when null game", async t => {
  const socket = { redis }
  const client = new Client({ }, socket)

  t.falsy(await client.subscribeGame(null))
})

test("subscribeGame: when actual game", async t => {
  const send = spy()

  const subscribeAsync = spy()
  const redis = { subscribeAsync, on: identity }

  const socket = { redis, send }

  const client = new Client({}, socket)

  const uuid = v4()
  const game = {
    get: () => { return uuid },
    serialize: () => ({ })
  }

  await client.subscribeGame(game)

  t.true(subscribeAsync.calledOnceWith(uuid))
  t.true(send.calledOnce)
})
