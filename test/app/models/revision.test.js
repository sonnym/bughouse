import test from "ava"

import Revision from "./../../../src/app/models/revision"

test("tableName method", t => {
  t.is(Revision.forge().tableName, "revisions")
})

test("hasTimestamps method", t => {
  t.true(Revision.forge().hasTimestamps)
})
