import test from "ava"
import Profile from "~/app/models/profile"

test("forging instance", t => {
  t.not(Profile.forge(), null)
})

test("uuid property", t => {
  t.not(Profile.forge().uuid, null)
})
