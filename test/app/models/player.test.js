import test from "ava"

import { spy } from "sinon"

import Factory from "@/factory"

import { WHITE, PAWN } from "~/share/constants/chess"
import { MOVE } from "~/share/constants/revision_types"

import Player from "~/app/models/player"

test("play: prevents not-logged in user", async t => {
  const player = new Player()

  t.falsy(await player.play())
})

test("play: registers player with universe", async t => {
  const play = spy()
  const universe = { play }

  const subscribeGameCreation = spy()
  const redisMediator = { subscribeGameCreation }

  const user = Factory.user()

  const player = new Player({ universe, redisMediator, user })

  await player.play()

  t.is(1, play.callCount)
  t.is(1, subscribeGameCreation.callCount)
})

test("move: when no gameUUID, returns false", async t => {
  const player = new Player()
  const revision = await player.move()

  t.falsy(revision)
})

test("move: when gameUUID, creates and returns revision", async t => {
  const game = await Factory.game()

  const player = new Player()
  player.gameUUID = game.get("uuid")
  player.color = WHITE

  const revision = await player.move({
    type: MOVE,
    from: "e2",
    to: "e4"
  })

  t.truthy(revision)
})

test.todo("move: captures")

test("move: when result", async t => {
  const fen = "rnbqkbnr/ppppp2p/8/5pp1/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 3"
  const game = await Factory.game({ fen })

  const player = new Player()
  player.gameUUID = game.get("uuid")
  player.color = WHITE

  const revision = await player.move({
    type: MOVE,
    from: "d1",
    to: "h5"
  })

  t.truthy(revision)
})

test("drop: noop when no gameUUID", async t => {
  const revision = await new Player().drop()

  t.falsy(revision)
})

test("drop: creates a new revision", async t => {
  const game = await Factory.game({
    reserves: { [WHITE]: { [PAWN]: 1 } }
  })

  const player = new Player()

  player.gameUUID = game.get("uuid")
  player.color = WHITE

  const revision = await player.drop({ piece: PAWN, square: "e4" })

  t.truthy(revision)
})
