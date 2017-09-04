import test from "ava"
import Profile from "./../../../src/app/models/profile"

test("building instance", t => {
  t.not(Profile.build(), null)
})

test("uuid property", t => {
  t.not(Profile.build().uuid, null)
})
