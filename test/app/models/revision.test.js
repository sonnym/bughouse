import test from "ava"

import Factory from "@/factory"

import { WHITE, BLACK } from "~/share/constants/chess"
import { MOVE } from "~/share/constants/revision_types"

import Revision from "~/app/models/revision"

test("tableName", t => {
  t.is(Revision.forge().tableName, "revisions")
})

test("hasTimestamps", t => {
  t.true(Revision.forge().hasTimestamps)
})

test("move: when valid", async t => {
  const game = await Factory.game()
  const uuid = game.get("uuid")
  const move = { from: "e2", to: "e4" }

  const revision = await Revision.move(uuid, WHITE, move)
  const position = await revision.position().fetch()

  t.truthy(revision.get("move"))
  t.truthy(revision)

  t.is(1, position.get("move_number"))
  t.is(
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    position.get("m_fen")
  )
})

test("move: when invalid", async t => {
  const game = await Factory.game()
  const uuid = game.get("uuid")
  const move = { game, from: "e2", to: "e2", promotion: null }

  t.false(await Revision.move(uuid, WHITE, move))
})

test("move: when game is over", async t => {
  const fen = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78"
  const game = await Factory.game({ fen })
  const uuid = game.get("uuid")

  t.false(await Revision.move(uuid, BLACK))
})

test("move: color is not current to move", async t => {
  const game = await Factory.game()
  const uuid = game.get("uuid")
  const move = { game, from: "e2", to: "e2", promotion: null }

  t.false(await Revision.move(uuid, BLACK, move))
})

test("reserve: increments move number and stores piece", async t => {
  const source = await Factory.game()
  const target = await Factory.game()

  const piece = "p"

  const revision = await Revision.reserve(source, target.get("uuid"), piece)
  await revision.refresh({ withRelated: ["position"] })

  const position = revision.related("position")

  t.is(1, position.get("move_number"))
  t.is(1, position.get("black_reserve")[piece])
})

test("serialize", async t => {
  const game = await Factory.game()

  const revision = await Revision.move(
    game.get("uuid"),
    WHITE,
    { from: "g1", to: "f3" },
  )

  await revision.refresh({ withRelated: ["position"] })

  t.deepEqual({
    fen: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1",
    move: "Nf3",
    type: MOVE
  }, revision.serialize())
})
