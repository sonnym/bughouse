import test from "ava"

import { stub, spy } from "sinon"

import { v4 } from "uuid"

import Client from "~/app/models/client"

import Player from "~/app/models/player"
import Kibitzer from "~/app/models/kibitzer"

const client = new Client()

test("constructor: sets a uuid", t => {
  t.truthy(client.uuid)
})

test("constructor: creates a redis mediator", t => {
  t.truthy(client.redisMediator)
})

test("constructor: creates a kibitzer", t => {
  t.true(client.kibitzer instanceof Kibitzer)
})

test("constructor: creates a player", t => {
  t.true(client.player instanceof Player)
})

test("kibitz: passthrough to kibitzer", t => {
  const start = stub(client.kibitzer, "start")

  client.kibitz()

  t.true(start.calledOnce)
})

test("rotate: passthrough to kibitzer", t => {
  const spec = v4()
  const rotate = spy(client.kibitzer, "rotate")

  client.rotate(spec)

  t.true(rotate.calledOnceWith(spec))
})

test("play: passthrough to player", t => {
  const play = stub(client.player, "play")

  client.play()

  t.true(play.calledOnce)
})

test("start: passthrough to player", t => {
  const serializedGame = { }
  const color = v4()

  const start = stub(client.player, "start")

  client.start(serializedGame, color)

  t.true(start.calledOnceWith(serializedGame, color))
})

test("move: passthrough to player", t => {
  const spec = v4()
  const move = spy(client.player, "move")

  client.move(spec)

  t.true(move.calledOnceWith(spec))
})

test("end: passthrough to redisMediator", t => {
  const end = spy(client.redisMediator, "end")

  client.end()

  t.true(end.calledOnce)
})
