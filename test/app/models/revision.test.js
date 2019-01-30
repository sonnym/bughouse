import test from "ava"

import { int } from "./../../helpers/core"
import Factory from "./../../helpers/factory"

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
  const initialPositionCount = int(await Position.count())
  const initialRevisionCount = int(await Revision.count())

  const game = await Factory.game()

  t.true(await Revision.move({ game, from: "e2", to: "e4", promotion: null }))

  t.is(int(await Position.count()), initialPositionCount + 1)
  t.is(int(await Revision.count()), initialRevisionCount + 1)
})

test("invalid move", async t => {
  const initialPositionCount = int(await Position.count())
  const initialRevisionCount = int(await Revision.count())

  const game = await Factory.game()

  t.false(await Revision.move({ game, from: "e2", to: "e2", promotion: null }))

  t.is(int(await Position.count()), initialPositionCount)
  t.is(int(await Revision.count()), initialRevisionCount)
})
