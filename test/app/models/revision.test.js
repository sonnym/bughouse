import test from "ava"

import Factory from "@/factory"

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

  const { moveResult, revision } = await Revision.move(uuid, move)
  const position = await revision.position().fetch()

  t.truthy(moveResult)
  t.truthy(revision)

  t.is(1, position.get("move_number"))
  t.is(
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    position.get("m_fen")
  )
})

test.failing("move: when invalid", async t => {
  const game = await Factory.game()
  const uuid = game.get("uuid")
  const move = { game, from: "e2", to: "e2", promotion: null }

  t.false(await Revision.move(uuid, move))
})

test("move: when game is over", async t => {
  const game = await Factory.game("4k3/4P3/4K3/8/8/8/8/8 b - - 0 78")
  const uuid = game.get("uuid")

  t.false(await Revision.move(uuid))
})

test.failing("reserve: increments move number and stores piece", async t => {
  const source = await Factory.game()
  const target = await Factory.game()

  const piece = "p"

  const revision = await Revision.reserve(source, target.get("uuid"), piece)
  await revision.refresh({ withRelated: ["position"] })

  const position = revision.related("position")

  t.is(1, position.get("move_number"))
  t.is(1, position.get("black_reserve")[piece])
})
