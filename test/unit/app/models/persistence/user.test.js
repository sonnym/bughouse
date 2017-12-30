import test from "ava"

import { partialRight } from "ramda"
import { v4 } from "uuid"

import databaseHook from "./../../../../helpers/database"

import Email from "./../../../../../src/app/models/email"
import User from "./../../../../../src/app/models/user"

databaseHook(test)

const int = partialRight(parseInt, [10])

test.serial("createWithPassword given sufficient data", async t => {
  const initialUserCount = await int(User.count())
  const initialEmailCount = await int(Email.count())

  const user = await User.createWithPassword({
    email: `foo.${v4()}@example.com`,
    password: "fizzbuzz"
  })

  t.not(user.id, undefined)

  t.is(await int(User.count()), initialUserCount + 1)
  t.is(await int(Email.count()), initialEmailCount + 1)
})

test.serial("automatically hashes password before save", async t => {
  const password = "foobarbaz"
  const user = User.forge()

  t.is(user.password, undefined)
  t.is(user.passwordHash, undefined)

  user.password = password

  await user.save()

  t.is(user.passwordHash.length, 60)

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
