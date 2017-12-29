import test from "ava"
import User from "./../../../../src/app/models/user"

test("forging instance", t => {
  t.not(User.forge(), null)
})

test("uuid property", t => {
  t.not(User.forge().uuid, null)
})
