import test from "ava"
import * as db from "./../../helpers/database"
import User from "./../../../src/app/models/user"

test.beforeEach("set up database connnection", async t => {
  await db.connect()
})

test.afterEach("close database connection", t => {
  db.close()
})

test("building instance", t => {
  t.not(User.build(), null)
})

test("uuid property", t => {
  t.not(User.build().uuid, null)
})

test("automatically hashes password before save", async t => {
  const password = "foobarbaz"
  const user = User.build()

  t.is(user.password, undefined)
  t.is(user.passwordHash, undefined)

  user.password = password

  await user.save()

  t.true(await user.isValidPassword(password))
  t.false(await user.isValidPassword("fizzbuzz"))
})

test("does not attempt to hash empty", async t => {
  const user = User.build({ password: null })
  await user.save()

  t.is(user.passwordHash, undefined)
})

test("does not attempt to hash zero length passwords", async t => {
  const user = User.build({ password: null })
  await user.save()

  t.is(user.passwordHash, undefined)
})
