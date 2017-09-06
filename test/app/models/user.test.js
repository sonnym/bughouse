import test from "ava"
import dbConnect from "./../../helpers/database"
import User from "./../../../src/app/models/user"

test.beforeEach("set up database connnection", async t => {
  await dbConnect()
})

test("building instance", t => {
  t.not(User.build(), null)
})

test("uuid property", t => {
  t.not(User.build().uuid, null)
})
