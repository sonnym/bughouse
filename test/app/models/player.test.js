import test from "ava"

import { fake, spy } from "sinon"
import { v4 } from "uuid"

import { identity } from "ramda"

import Factory from "@/factory"

import Universe from "~/app/models/universe"
import List from "~/app/models/list"

import Player from "~/app/models/player"

test("play", async t => {
  const play = spy()
  const universe = { play }

  const player = new Player(universe)

  player.play()

  t.is(1, play.callCount)
})

test("revision", async t => {
  const send = fake()
  const client = { send }

  const game = await Factory.game()

  const player = new Player(null, client)
  player.serializedGame = await game.serialize()

  await player.revision({ type: "move" })

  t.pass()
})

test("subscribeGames: when no games", async t => {
  const universe = new Universe()
  const player = new Player(universe)

  t.falsy(await player.subscribeGames())
})

test("subscribeGames: when games", async t => {
  const redis = { subscribeAsync: identity, send: identity }
  const socket = { redis }

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
  const player = new Player(universe, socket)

  const subscribeGame = spy(player, "subscribeGame")
  await player.subscribeGames()

  t.is(subscribeGame.firstCall.args[0].get("uuid"), games[0].get("uuid"))
  t.is(subscribeGame.firstCall.args[1], "before")

  t.is(subscribeGame.secondCall.args[0].get("uuid"), games[1].get("uuid"))
  t.is(subscribeGame.secondCall.args[1], "primary")

  t.is(subscribeGame.thirdCall.args[0].get("uuid"), games[2].get("uuid"))
  t.is(subscribeGame.thirdCall.args[1], "after")
})

test("subscribeGame: when null game", async t => {
  const player = new Player()

  t.falsy(await player.subscribeGame(null))
})

test("subscribeGame: when actual game", async t => {
  const send = spy()

  const subscribeAsync = spy()
  const redis = { subscribeAsync }

  const socket = { redis, send }

  const player = new Player({}, socket)

  const uuid = v4()
  const game = {
    get: () => { return uuid },
    serialize: () => ({ })
  }

  await player.subscribeGame(game)

  t.true(subscribeAsync.calledOnceWith(uuid))
  t.true(send.calledOnce)
})
