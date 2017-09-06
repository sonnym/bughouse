import test from "ava"
import Email from "./../../../src/app/models/email"

test("building instance", t => {
  t.not(Email.build(), null)
})

test("uuid property", t => {
  t.not(Email.build().uuid, null)
})
