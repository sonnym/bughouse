import test from "ava"
import { stub, mock } from "sinon"

import User from "./../../../../src/app/models/user"
import * as UsersController from "./../../../../src/app/controllers/users"

test.beforeEach("set up request and response", t => {
  t.context.req = { user: new User }
  t.context.res = {
    json: () => {},
    location: () => {},
    end: () => {}
  }
})

test("index", async t => {
  let jsonMock = mock(t.context.res).expects("json").once()
  let fetchMock = mock(User).expects("fetchAll").once().returns([User.forge()])

  await UsersController.index(t.context.req, t.context.res)

  fetchMock.verify()
  jsonMock.verify()

  t.pass()
})

test("create", async t => {
  let locationMock = mock(t.context.res).expects("location").once()
  let endMock = mock(t.context.res).expects("end").once()
  let userMock  = mock(User).expects("forge").once().returns({ save: () => true })

  await UsersController.create(t.context.req, t.context.res)

  locationMock.verify()
  endMock.verify()

  t.pass()
})

test("show", t => {
  let jsonMock = mock(t.context.res).expects("json").once()

  UsersController.show(t.context.req, t.context.res)
  jsonMock.verify()

  t.pass()
})

test("update", t => {
  let jsonMock = mock(t.context.res).expects("json").once()

  UsersController.update(t.context.req, t.context.res)
  jsonMock.verify()

  t.pass()
})

test("destroy", t => {
  let jsonMock = mock(t.context.res).expects("json").once()

  UsersController.destroy(t.context.req, t.context.res)
  jsonMock.verify()

  t.pass()
})
