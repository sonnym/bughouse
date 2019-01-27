import test from "ava"

import Position from "./../../../src/app/models/position"

test("tableName method", t => {
  t.is(Position.forge().tableName, "positions")
})

test("hasTimestamps method", t => {
  t.true(Position.forge().hasTimestamps)
})

test("serialize", t => {
  t.truthy(Position.forge().serialize())
})
