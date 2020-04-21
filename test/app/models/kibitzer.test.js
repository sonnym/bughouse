import test from "ava"

import { stub, spy } from "sinon"

import { v4 } from "uuid"
import { identity } from "ramda"

import Factory from "@/factory"

import { LEFT, RIGHT } from "~/share/constants/direction"

import List from "~/app/models/list"
import Universe from "~/app/models/universe"
import Kibitzer from "~/app/models/kibitzer"

test("start: when no games", async t => {
  const universe = new Universe()
  const kibitzer = new Kibitzer({ universe })

  t.falsy(await kibitzer.start())
})

test("start: when games subscribes to game and sends to client", async t => {
  const subscribeGame = spy()
  const redisMediator = { subscribeGame }

  const socket = { send: identity }

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
  const kibitzer = new Kibitzer({ universe, socket, redisMediator })

  const sendGame = spy(kibitzer, "sendGame")
  await kibitzer.start()

  t.is(subscribeGame.firstCall.firstArg, games[0].get("uuid"))
  t.is(subscribeGame.secondCall.firstArg, games[1].get("uuid"))
  t.is(subscribeGame.thirdCall.firstArg, games[2].get("uuid"))

  t.is(sendGame.firstCall.args[0].get("uuid"), games[0].get("uuid"))
  t.is(sendGame.firstCall.args[1], "before")

  t.is(sendGame.secondCall.args[0].get("uuid"), games[1].get("uuid"))
  t.is(sendGame.secondCall.args[1], "primary")

  t.is(sendGame.thirdCall.args[0].get("uuid"), games[2].get("uuid"))
  t.is(sendGame.thirdCall.args[1], "after")
})

test("rotate: unknown", async t => {
  const subscribeGame = spy()
  const redisMediator = { subscribeGame }

  const kibitzer = new Kibitzer({ redisMediator })

  const sendGame = spy(kibitzer, "sendGame")

  kibitzer.rotate({ direction: v4() })

  t.true(sendGame.notCalled)
  t.true(subscribeGame.notCalled)
})

test.serial("rotate: LEFT", async t => {
  const game = await Factory.game()

  const of = v4()
  const universe = {
    nextGame: async (it) => { return it === of ? game.get("uuid") : null }
  }

  const subscribeGame = spy()
  const redisMediator = { subscribeGame }

  const kibitzer = new Kibitzer({ universe, redisMediator })

  const sendGame = stub(kibitzer, "sendGame")

  await kibitzer.rotate({ direction: LEFT, of })

  t.true(subscribeGame.calledOnceWith(game.get("uuid")))
  t.true(sendGame.calledOnce)
})

test.serial("rotate RIGHT", async t => {
  const game = await Factory.game()

  const of = v4()
  const universe = {
    prevGame: async (it) => { return it === of ? game.get("uuid") : null }
  }

  const subscribeGame = spy()
  const redisMediator = { subscribeGame }

  const kibitzer = new Kibitzer({ universe, redisMediator })

  const sendGame = stub(kibitzer, "sendGame")

  await kibitzer.rotate({ direction: RIGHT, of })

  t.true(subscribeGame.calledOnceWith(game.get("uuid")))
  t.true(sendGame.calledOnce)
})
