import test from "ava"
import request from "supertest"

import { v4 } from "uuid"

import appGenerator from "./../helpers/app"
import User from "./../../src/app/models/user"

test.beforeEach(t => {
  t.context.app = appGenerator()
})

test("can login", async t => {
  const email = `test.${v4()}@example.com`
  const password = "test1234"
  const displayName = "test1234"

  await User.create({ email, password, displayName })
  const res = await request(t.context.app).post("/sessions").send(JSON.stringify({
    email,
    password
  }))

  t.is(res.status, 201)
})
