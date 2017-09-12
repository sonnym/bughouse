import test from "ava"
import { stub, mock } from "sinon"

import User from "./../../../src/app/models/user"
import * as UsersController from "./../../../src/app/controllers/users"

test.beforeEach("set up request and response", t => {
  t.context.req = { user: User.forge() }
  t.context.res = { json: () => {} }

  mock(t.context.res).expects("json").once
})

test.afterEach("verify mock", t => {
  mock.verify()
})

test("index", async t => {
  let fetchMock = mock(User).expects("fetchAll").once().returns([User.forge()])

  await UsersController.index(t.context.req, t.context.res)

  fetchMock.verify()
  t.pass()
})

test("create", t => {
  UsersController.create(t.context.req, t.context.res)
  t.pass()
})

test("show", t => {
  UsersController.show(t.context.req, t.context.res)
  t.pass()
})

test("update", t => {
  UsersController.update(t.context.req, t.context.res)
  t.pass()
})

test("destroy", t => {
  UsersController.destroy(t.context.req, t.context.res)
  t.pass()
})
