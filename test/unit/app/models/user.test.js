import test from "ava"
import User from "./../../../../src/app/models/user"

test("tableName method", t => {
  t.is(User.forge().tableName, "users")
})

test("hasTimestamps method", t => {
  t.true(User.forge().hasTimestamps)
})
