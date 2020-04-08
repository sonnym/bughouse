import test from "ava"

import { v4 } from "uuid"

import Factory from "@/factory"

import * as UsersController from "~/app/controllers/users"

test.serial("unsuccessful create", async t => {
  await UsersController.create(
    { body: { } },
    Factory.res(t, 400),
    Factory.next(t)
  )
})

test.serial("successful create", async t => {
  const email =  `${v4()}@example.com`
  const displayName = v4()
  const req = {
    login: (user, fn) => fn(null),
    body: {
      email,
      displayName,
      password: v4()
    }
  }

  await UsersController.create(
    req,
    Factory.res(t, 201),
    Factory.next(t)
  )
})

test("show with a valid uuid", async t => {
  const user = await Factory.user()
  await user.refresh()

  await UsersController.show(
    Factory.req({ uuid: user.get("uuid")}),
    Factory.res(t, 200, await user.serialize()),
    Factory.next(t)
  )
})

test("show with an invalid uuid", async t => {
  await UsersController.show(
    Factory.req({ uuid: "" }),
    Factory.res(t, 404, { }),
    Factory.next(t)
  )
})