import test from "ava"
import sinon from "sinon"

import authentication from "./../../src/app/authentication"
import User from "./../../src/app/models/user"

test.before(async t => {
  t.context.passport = {
    serializeUser: function(fn) { this.serializeUser = fn },
    deserializeUser: function(fn) { this.deserializeUser = fn }
  }

  t.context.user = await new User().save()
  t.context.id = t.context.user.get("id")

  t.context.done = sinon.fake()

  authentication(t.context.passport)
})

test("serializing user returns id", t => {
  t.context.passport.serializeUser.call(null, t.context.user, t.context.done)

  t.is(
    t.context.done.lastCall.lastArg,
    t.context.id
  )
})

test("deserializing user returns user", async t => {
  await t.context.passport.deserializeUser.call(null, t.context.id, t.context.done)

  t.is(
    t.context.done.lastCall.lastArg.get("id"),
    t.context.user.get("id")
  )
})
