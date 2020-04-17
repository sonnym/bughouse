import test from "ava"

import { spy } from "sinon"

import { identity } from "ramda"

import Factory from "@/factory"

import { WHITE } from "~/share/constants/chess"
import { MOVE } from "~/share/constants/revision_types"

import Player from "~/app/models/player"

test("play: registers player with universe", async t => {
  const registerPlayer = spy()
  const universe = { registerPlayer }

  const player = new Player({ universe })

  player.play()

  t.is(1, registerPlayer.callCount)
})

test("move: when no gameUUID", async t => {
  const player = new Player({ })
  const move = await player.move()

  t.falsy(move)
})

test("move: when gameUUID, creates revision and publishes position", async t => {
  const publishPosition = spy()
  const universe = { publishPosition }

  const game = await Factory.game()

  const player = new Player({ universe })
  player.gameUUID = game.get("uuid")
  player.color = WHITE

  await player.move({
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

  const player = new Player({ universe })
  player.gameUUID = game.get("uuid")
  player.color = WHITE

  await player.move({
    type: MOVE,
    from: "d1",
    to: "h5"
  })

  t.true(publishResult.calledOnce)
})
