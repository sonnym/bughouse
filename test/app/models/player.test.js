import test from "ava"

import { spy, fake } from "sinon"

import Factory from "@/factory"

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
