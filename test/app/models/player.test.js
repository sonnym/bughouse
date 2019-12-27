import test from "ava"

import { fake } from "sinon"

import Factory from "@/factory"

import Universe from "~/app/models/universe"
import Player from "~/app/models/player"

const send = fake()

Universe.init()

test("play", async t => {
  const player = new Player({ send })
  const user = await Factory.user()

  player.client = { user }

  player.play()

  t.pass()
})

test("revision", async t => {
  const game = await Factory.game()
  const player = new Player({ send })

  player.gameUUID = game.get("uuid")

  await player.revision({ type: "move" })

  t.pass()
})

