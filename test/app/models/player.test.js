import test from "ava"
import sinon from "sinon"

import Factory from "@/factory"

import Universe from "~/app/models/universe"
import Player from "~/app/models/player"

const send = sinon.fake()
Universe.init()

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

