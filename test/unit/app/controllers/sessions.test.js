import test from "ava"
import { mock } from "sinon"

import User from "./../../../../src/app/models/user"

import * as SessionsController from "./../../../../src/app/controllers/sessions"

test.serial("create when user is not found", async t => {
  const req = {
    body: {
      email: "foo@example.com",
      password: "test1234"
    }
  }

  const res = { redirect: () => {} }
  const resMock = mock(res)

  resMock.expects("redirect").once()

  const fetchOne = { fetchOne: async () => { } }
  let fetchMock = mock(fetchOne)
    .expects("fetchOne")
    .once()
    .resolves(null)

  let queryMock = mock(User)
    .expects("query")
    .once()
    .returns(fetchOne)

  await SessionsController.create(req, res)

  queryMock.verify()
  fetchMock.verify()
  resMock.verify()

  User.query.restore()

  t.pass()
})

test.serial("create when user is found and password is incorrect", async t => {
  const req = {
    body: {
      email: "foo@example.com",
      password: "test1234"
    }
  }

  const res = { redirect: () => {} }
  const resMock = mock(res)

  resMock.expects("redirect").once()

  const user = User.forge()
  let userMock = mock(user)
    .expects("isValidPassword")
    .once()
    .resolves(true)

  const fetchOne = { fetchOne: async () => { } }
  let fetchMock = mock(fetchOne)
    .expects("fetchOne")
    .once()
    .resolves(user)

  let queryMock = mock(User)
    .expects("query")
    .once()
    .returns(fetchOne)

  await SessionsController.create(req, res)

  queryMock.verify()
  fetchMock.verify()
  userMock.verify()
  resMock.verify()

  User.query.restore()

  t.pass()
})

test.serial("create when user is found and password is correct", async t => {
  const req = {
    body: {
      email: "foo@example.com",
      password: "test1234"
    }
  }

  const res = { redirect: () => {} }
  const resMock = mock(res)

  resMock.expects("redirect").once()

  const user = User.forge()
  let userMock = mock(user)
    .expects("isValidPassword")
    .once()
    .resolves(true)

  const fetchOne = { fetchOne: async () => { } }
  let fetchMock = mock(fetchOne)
    .expects("fetchOne")
    .once()
    .resolves(user)

  let queryMock = mock(User)
    .expects("query")
    .once()
    .returns(fetchOne)

  await SessionsController.create(req, res)

  queryMock.verify()
  fetchMock.verify()
  userMock.verify()
  resMock.verify()

  User.query.restore()

  t.pass()
})
