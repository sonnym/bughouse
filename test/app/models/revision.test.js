import test from "ava"

import { int } from "./../../helpers/core"
import Factory from "./../../helpers/factory"

import Position from "./../../../src/app/models/position"
import Revision from "./../../../src/app/models/revision"

test("tableName method", t => {
  t.is(Revision.forge().tableName, "revisions")
})

test("hasTimestamps method", t => {
  t.true(Revision.forge().hasTimestamps)
})

test("valid move", async t => {
  const initialPositionCount = await int(Position.count())
  const initialRevisionCount = await int(Revision.count())

  const game = await Factory.game()

  t.true(await Revision.move(game, "e2", "e4", null))

  t.is(await int(Position.count()), initialPositionCount + 1)
  t.is(await int(Revision.count()), initialRevisionCount + 1)
})

test("invalid move", async t => {
  const initialPositionCount = await int(Position.count())
  const initialRevisionCount = await int(Revision.count())

  const game = await Factory.game()

  t.false(await Revision.move(game, "e2", "e2", null))

  t.is(await int(Position.count()), initialPositionCount)
  t.is(await int(Revision.count()), initialRevisionCount)
})
