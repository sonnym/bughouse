import test from "ava"

import Position from "~/app/models/position"

test("tableName method", t => {
  t.is(Position.forge().tableName, "positions")
})

test("hasTimestamps method", t => {
  t.true(Position.forge().hasTimestamps)
})

test("serialize", t => {
  const json = Position.forge().serialize()

  t.truthy(json)

  t.true("fen" in json)
  t.true("reserves" in json)
  t.true("w" in json.reserves)
  t.true("b" in json.reserves)
})
