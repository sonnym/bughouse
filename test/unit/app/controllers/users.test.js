import test from "ava"
import { mock, sandbox } from "sinon"
import { v1 } from "uuid"

import User from "./../../../../src/app/models/user"

import * as UsersController from "./../../../../src/app/controllers/users"

test.beforeEach("set up response", t => {
  t.context.res = { json: () => {} }
})

test("index", async t => {
  let jsonMock = mock(t.context.res).expects("json").once()
  let fetchMock = mock(User).expects("fetchAll").once().returns([User.forge()])

  await UsersController.index({ }, t.context.res)

  fetchMock.verify()
  jsonMock.verify()

  t.pass()
})

test.serial("unsuccessful create", async t => {
  const res = { redirect: () => {} }
  const resMock = mock(res)

  resMock.expects("redirect").once()

  const userMock = mock(User)
    .expects("createWithPassword")
    .once()
    .returns({ save: () => false })

  await UsersController.create({ }, res)

  resMock.verify()

  userMock.verify()
  userMock.restore()

  t.pass()
})

test.serial("successful create", async t => {
  const req = {
    email: "foo@example.com",
    password: "test1234"
  }

  const res = { redirect: () => {} }
  const resMock = mock(res)

  resMock.expects("redirect").once()

  const userMock = mock(User)
    .expects("createWithPassword")
    .once()
    .returns({ save: () => true })

  await UsersController.create({ }, res)

  resMock.verify()

  userMock.verify()
  userMock.restore()

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
