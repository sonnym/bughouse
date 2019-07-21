import test from "ava"

import { int } from "@/core"
import Factory from "@/factory"

import Position from "~/app/models/position"
import Revision from "~/app/models/revision"

test("tableName method", t => {
  t.is(Revision.forge().tableName, "revisions")
})

test("hasTimestamps method", t => {
  t.true(Revision.forge().hasTimestamps)
})

test("create with invalid type", async t => {
  await Revision.create(null, { type: "foobar" })

  t.pass()
})

test("valid move", async t => {
  const game = await Factory.game()

  const initialPositionCount = int(await game.positions().count())
  const initialRevisionCount = int(await game.revisions().count())

  t.true(await Revision.move({ game, from: "e2", to: "e4", promotion: null }))

  t.is(int(await game.positions().count()), initialPositionCount + 1)
  t.is(int(await game.revisions().count()), initialRevisionCount + 1)
})

test("invalid move", async t => {
  const game = await Factory.game()

  const initialPositionCount = int(await game.positions().count())
  const initialRevisionCount = int(await game.revisions().count())

  t.false(await Revision.move({ game, from: "e2", to: "e2", promotion: null }))

  t.is(int(await game.positions().count()), initialPositionCount)
  t.is(int(await game.revisions().count()), initialRevisionCount)
})

test("move when game is over", async t => {
  const game = await Factory.game()

  await Position.forge({ game, fen: "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78" })

  t.false(await Revision.move({ game }))
})
