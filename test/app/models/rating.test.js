import test from "ava"

import Rating from "~/app/models/rating"

test("tableName method", t => {
  t.is(Rating.forge().tableName, "ratings")
})

test("hasTimestamps method", t => {
  t.true(Rating.forge().hasTimestamps)
})
