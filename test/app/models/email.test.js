import test from "ava"
import Email from "~/app/models/email"

test("tableName method", t => {
  t.is(Email.forge().tableName, "emails")
})

test("hasTimestamps method", t => {
  t.true(Email.forge().hasTimestamps)
})
