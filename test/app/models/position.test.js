import test from "ava"

import Position from "./../../../src/app/models/position"

test("tableName method", t => {
  t.is(Position.forge().tableName, "positions")
})
