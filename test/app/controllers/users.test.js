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

  const req = { params: { uuid: user.get("uuid") } }

  const res = {
    status: httpStatus => {
      t.is(200, httpStatus)

      return {
        send: async (json) => { t.is(await user.serialize(), json) }
      }
    }
  }

  const next = t.log.bind(t)

  await UsersController.show(req, res, next)
})
