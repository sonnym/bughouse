import test from "ava"
import sinon from "sinon"

import Factory from "./../../helpers/factory"

import Universe from "./../../../src/app/models/universe"
import Player from "./../../../src/app/models/player"

const send = sinon.fake()
Universe.init()

test("redisClient", t => {
  const player = new Player()

  t.truthy(player.redisClient)
  t.is(player.redisClient, player.redisClient)
})

test("play", async t => {
  const player = new Player({ send })
  player.user = await Factory.user()

  await player.play()

  t.pass()
})

test("revision", async t => {
  const game = await Factory.game()
  const player = new Player({ send })
  player.gameUUID = game.get("uuid")

  player.revision({ type: "move" })

  t.pass()
})

