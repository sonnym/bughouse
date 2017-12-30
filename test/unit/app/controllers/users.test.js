import test from "ava"
import { mock, sandbox } from "sinon"
import { v1 } from "uuid"

import Email from "./../../../../src/app/models/email"
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

test.serial("create with empty data", async t => {
  const req = { body: { } }
  const res = {
    location: () => {},
    end: () => {},
  }

  const resMock = mock(res)
  resMock.expects("location").once()
  resMock.expects("end").once()

  const emailMock  = mock(Email)
    .expects("forge")
    .once()
    .returns({ save: () => false })

  await UsersController.create({ }, res)

  resMock.verify()

  emailMock.verify()
  emailMock.restore()

  t.pass()
})

test.serial("create with sufficient data", async t => {
  const req = {
    body: {
      password: "foobar",
      email: `foobar.${v1()}@example.com`
    }
  }

  const res = {
    location: () => {},
    end: () => {},
  }

  const resMock = mock(res)
  resMock.expects("location").once()
  resMock.expects("end").once()

  const emailMock  = mock(Email)
    .expects("forge")
    .once()
    .returns({ save: () => true })

  await UsersController.create({ }, res)

  resMock.verify()

  emailMock.verify()
  emailMock.restore()

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
