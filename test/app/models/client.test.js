import test from "ava"

import { spy, stub } from "sinon"
import { v4 } from "uuid"

import { identity } from "ramda"

import Factory from "@/factory"

import { WHITE } from "~/share/constants/chess"
import { LEFT, RIGHT } from "~/share/constants/direction"
import { MOVE } from "~/share/constants/revision_types"

import Universe from "~/app/models/universe"
import List from "~/app/models/list"

import Client from "~/app/models/client"

test("constructor: sets a uuid", t => {
  const client = new Client()

  t.truthy(client.uuid)
})

test("constructor: creates a redis mediator", t => {
  const client = new Client()

  t.truthy(client.redisMediator)
})

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
  const client = new Client(universe, {}, socket)

  const subscribeGame = spy(client, "sendGame")
  await client.kibitz()

  t.is(subscribeGame.firstCall.args[0].get("uuid"), games[0].get("uuid"))
  t.is(subscribeGame.firstCall.args[1], "before")

  t.is(subscribeGame.secondCall.args[0].get("uuid"), games[1].get("uuid"))
  t.is(subscribeGame.secondCall.args[1], "primary")

  t.is(subscribeGame.thirdCall.args[0].get("uuid"), games[2].get("uuid"))
  t.is(subscribeGame.thirdCall.args[1], "after")
})

test("rotate: unknown", async t => {
  const subscribeGame = spy()
  const redisMediator = { subscribeGame }

  const client = new Client()

  const sendGame = spy(client, "sendGame")
  client.redisMediator = redisMediator

  client.rotate({ direction: v4() })

  t.true(sendGame.notCalled)
  t.true(subscribeGame.notCalled)
})

test("rotate: LEFT", async t => {
  const game = await Factory.game()

  const of = v4()
  const universe = {
    nextGame: async (it) => { return it === of ? game.get("uuid") : null }
  }

  const subscribeGame = spy()
  const redisMediator = { subscribeGame }

  const client = new Client(universe)

  const sendGame = stub(client, "sendGame")
  client.redisMediator = redisMediator

  await client.rotate({ direction: LEFT, of })

  t.true(subscribeGame.calledOnceWith(game.get("uuid")))
  t.true(sendGame.calledOnce)
})

test("rotate RIGHT", async t => {
  const game = await Factory.game()

  const of = v4()
  const universe = {
    prevGame: async (it) => { return it === of ? game.get("uuid") : null }
  }

  const subscribeGame = spy()
  const redisMediator = { subscribeGame }

  const client = new Client(universe)

  const sendGame = stub(client, "sendGame")
  client.redisMediator = redisMediator

  await client.rotate({ direction: RIGHT, of })

  t.true(subscribeGame.calledOnceWith(game.get("uuid")))
  t.true(sendGame.calledOnce)
})

test("play: registers client with universe", async t => {
  const registerClient = spy()
  const universe = { registerClient }

  const client = new Client(universe)

  client.play()

  t.is(1, registerClient.callCount)
})

test("move: when no gameUUID", async t => {
  const client = new Client()
  const move = await client.move()

  t.falsy(move)
})

test("move: when gameUUID, creates revision and publishes position", async t => {
  const publishPosition = spy()
  const universe = { publishPosition }

  const game = await Factory.game()

  const client = new Client(universe)
  client.gameUUID = game.get("uuid")
  client.color = WHITE

  await client.move({
    type: MOVE,
    from: "e2",
    to: "e4"
  })

  t.true(publishPosition.calledOnce)
})

test.todo("move: captures")

test("move: when result", async t => {
  const publishPosition = identity
  const publishResult = spy()
  const universe = { publishPosition, publishResult }

  const fen = "rnbqkbnr/ppppp2p/8/5pp1/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 3"
  const game = await Factory.game({ fen })

  const client = new Client(universe)
  client.gameUUID = game.get("uuid")
  client.color = WHITE

  await client.move({
    type: MOVE,
    from: "d1",
    to: "h5"
  })

  t.true(publishResult.calledOnce)
})
