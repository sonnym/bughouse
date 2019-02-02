import test from "ava"
import { mock } from "sinon"

import { v4 } from "uuid"

import Factory from "./../../helpers/factory"

import * as UsersController from "~/app/controllers/users"

test.serial("unsuccessful create", async t => {
  const res = { status: () => {} }
  const resMock = mock(res)

  resMock.expects("status").once().returns({ end: () => {} })

  await UsersController.create({ }, res, () => { })

  resMock.verify()
  t.pass()
})

test.serial("successful create", async t => {
  const res = { status: () => {} }
  const resMock = mock(res)

  resMock.expects("status").once().returns({ send: () => {} })

  await UsersController.create({
    login: (user, fn) => fn(null),
    body: {
      email: `${v4()}@example.com`,
      password: v4(),
      displayName: v4()
    }
  }, res)

  resMock.verify()
  t.pass()
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
