import test from "ava"

import { v4 } from "uuid"

import { int } from "@/core"
import Factory from "@/factory"

import User from "~/app/models/user"
import Email from "~/app/models/email"
import Profile from "~/app/models/profile"

test("tableName method", t => {
  t.is(User.forge().tableName, "users")
})

test("hasTimestamps method", t => {
  t.true(User.forge().hasTimestamps)
})

test("create given sufficient data", async t => {
  const initialUserCount = await int(User.count())
  const initialEmailCount = await int(Email.count())
  const initialProfileCount = await int(Profile.count())

  const user = await Factory.user()

  t.not(user.id, undefined)

  t.is(await int(User.count()), initialUserCount + 1)
  t.is(await int(Email.count()), initialEmailCount + 1)
  t.is(await int(Profile.count()), initialProfileCount + 1)
})

test("profile", async t => {
  const user = await Factory.user()
  const profile = await user.profile()

  t.true(profile instanceof Profile)
})

test("serialization", async t => {
  const displayName = v4();
  const user = await User.create({
    email: `foo.${v4()}@example.com`,
    password: v4(),
    displayName
  })

  await user.refresh()
  const userData = await user.serialize()

  t.is(displayName, userData.displayName)
  t.truthy(userData.uuid)
})

test("automatically hashes password before save", async t => {
  const password = "foobarbaz"
  const user = User.forge({ password })

  t.is(user.get("password_hash"), undefined)

  user.password = password

  await user.save()

  t.is(user.get("password_hash").length, 60)

  t.true(await user.isValidPassword(password))
  t.false(await user.isValidPassword("fizzbuzz"))
})

test("does not attempt to hash empty", async t => {
  const user = User.forge({ password: null })
  await user.save()

  t.is(user.passwordHash, undefined)
})

test("does not attempt to hash zero length passwords", async t => {
  const user = User.forge({ password: null })
  await user.save()

  t.is(user.passwordHash, undefined)
})
