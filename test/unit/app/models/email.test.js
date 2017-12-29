import test from "ava"
import Email from "./../../../../src/app/models/email"

test("forging instance", t => {
  t.not(Email.forge(), null)
})

test("uuid property", t => {
  t.not(Email.forge().uuid, null)
})
