import test from "ava"

import { int } from "./../../helpers/core"
import Factory from "./../../helpers/factory"

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
