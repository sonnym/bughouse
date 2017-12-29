import test from "ava"
import User from "./../../../../src/app/models/user"
import databaseHook from "./../../../helpers/database"

databaseHook(test)

test.serial("automatically hashes password before save", async t => {
  const password = "foobarbaz"
  const user = User.forge()

  t.is(user.password, undefined)
  t.is(user.passwordHash, undefined)

  user.password = password

  await user.save()

  t.true(await user.isValidPassword(password))
  t.false(await user.isValidPassword("fizzbuzz"))
})

test.serial("does not attempt to hash empty", async t => {
  const user = User.forge({ password: null })
  await user.save()

  t.is(user.passwordHash, undefined)
})

test.serial("does not attempt to hash zero length passwords", async t => {
  const user = User.forge({ password: null })
  await user.save()

  t.is(user.passwordHash, undefined)
})
