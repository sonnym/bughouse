import test from "ava"
import { mock } from "sinon"

import { v4 } from "uuid"

import User from "./../../../../src/app/models/user"
import * as UsersController from "./../../../../src/app/controllers/users"

test.beforeEach("set up response", t => {
  t.context.res = { json: () => {} }
})

test("index", async t => {
  let jsonMock = mock(t.context.res).expects("json").once()

  await UsersController.index({ }, t.context.res)

  jsonMock.verify()

  t.pass()
})

test.serial("unsuccessful create", async t => {
  const res = { status: () => {} }
  const resMock = mock(res)

  resMock.expects("status").once().returns({ end: () => {} })

  await UsersController.create({ }, res)

  resMock.verify()
  t.pass()
})

test.serial("successful create", async t => {
  const res = { status: () => {} }
  const resMock = mock(res)

  resMock.expects("status").once().returns({ send: () => {} })

  await UsersController.create({
    body: {
      email: `${v4()}@example.com`,
      password: v4(),
      displayName: v4()
    }
  }, res)

  resMock.verify()
  t.pass()
})

test("show", t => {
  let jsonMock = mock(t.context.res).expects("json").once()

  UsersController.show({ }, t.context.res)
  jsonMock.verify()

  t.pass()
})

test("update", t => {
  let jsonMock = mock(t.context.res).expects("json").once()

  UsersController.update({ }, t.context.res)
  jsonMock.verify()

  t.pass()
})

test("destroy", t => {
  let jsonMock = mock(t.context.res).expects("json").once()

  UsersController.destroy({ }, t.context.res)
  jsonMock.verify()

  t.pass()
})
