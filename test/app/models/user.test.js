import test from "ava"
import User from "./../../../src/app/models/user"

test("building instance", t => {
  t.not(User.build(), null)
})

test("uuid property", t => {
  t.not(User.build().uuid, null)
})
