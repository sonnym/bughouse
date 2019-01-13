import test from "ava"

import { partialRight } from "ramda"
import { v4 } from "uuid"

import User from "./../../../../src/app/models/user"
import Email from "./../../../../src/app/models/email"
import Profile from "./../../../../src/app/models/profile"

test("tableName method", t => {
  t.is(User.forge().tableName, "users")
})

test("hasTimestamps method", t => {
  t.true(User.forge().hasTimestamps)
})

test.serial("createWithPassword given sufficient data", async t => {
  const int = partialRight(parseInt, [10])

  const initialUserCount = await int(User.count())
  const initialEmailCount = await int(Email.count())
  const initialProfileCount = await int(Profile.count())

  const user = await User.createWithPassword({
    email: `foo.${v4()}@example.com`,
    password: v4(),
    displayName: v4(),
  })

  t.not(user.id, undefined)

  t.is(await int(User.count()), initialUserCount + 1)
  t.is(await int(Email.count()), initialEmailCount + 1)
  t.is(await int(Profile.count()), initialProfileCount + 1)
})

test.serial("automatically hashes password before save", async t => {
  const password = "foobarbaz"
  const user = User.forge({ password })

  t.is(user.get("password_hash"), undefined)

  user.password = password

  await user.save()

  t.is(user.get("password_hash").length, 60)

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
