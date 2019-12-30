import test from "ava"

import Factory from "@/factory"

import Position from "~/app/models/position"
import Revision from "~/app/models/revision"

import { REVISION_TYPES } from "~/share/constants"

test("tableName", t => {
  t.is(Revision.forge().tableName, "revisions")
})

test("hasTimestamps", t => {
  t.true(Revision.forge().hasTimestamps)
})

test.serial("create: with invalid type does not raise", async t => {
  t.notThrows(() => {
    Revision.create(null, { type: "foobar" })
  })
})

test.serial("create: with a valid type returns result", async t => {
  const game = await Factory.game()
  const move = { from: "a1", to: "a8" }
  const type = REVISION_TYPES.MOVE

  const result = await Revision.create(game, { type, ...move })

  t.false(result) // invalid move
})

test("move: when valid", async t => {
  const game = await Factory.game()
  const move = { from: "e2", to: "e4" }

  const revision = await Revision.move(game, move)
  const position = await revision.position().fetch()

  t.truthy(revision)

  // TODO: set default to zero
  t.is(2, position.get("move_number"))
  t.is(
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    position.get("m_fen")
  )
})

test("move: when invalid", async t => {
  const game = await Factory.game()
  const move = { game, from: "e2", to: "e2", promotion: null }

  t.false(await Revision.move(game, move))
})

test("move: when game is over", async t => {
  const game = await Factory.game()

  const position = await Position.forge({
    move_number: 2,
    m_fen: "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78",
  }).save()

  await Revision.forge({
    game_id: game.get("id"),
    source_game_id: game.get("id"),
    position_id: position.get("id"),
    type: REVISION_TYPES.MOVE
  }).save()

  await game.refresh()

  t.false(await Revision.move(game, { }))
})
