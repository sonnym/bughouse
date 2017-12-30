import { inspect } from "util"

import test from "ava"
import { v4 } from "uuid"

import databaseHook from "./../../../../helpers/database"

import Email from "./../../../../../src/app/models/email"
import User from "./../../../../../src/app/models/user"

databaseHook(test)

test.serial("createWithPassword given sufficient data", async t => {
  const initialUserCount = await parseInt(User.count(), 10)
  const initialEmailCount = await parseInt(Email.count(), 10)

  const user = await User.createWithPassword({
    email: `foo.${v4()}@example.com`,
    password: "fizzbuzz"
  })

  t.not(user.id, undefined)

  t.is(await parseInt(User.count(), 10), initialUserCount + 1)
  t.is(await parseInt(Email.count(), 10), initialEmailCount + 1)
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
