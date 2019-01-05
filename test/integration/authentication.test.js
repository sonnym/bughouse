import test from "ava"
import request from "supertest"

import { v4 } from "uuid"

import appGenerator from "./../helpers/app"
import User from "./../../src/app/models/user"

test.beforeEach(t => {
  t.context.app = appGenerator()
})

test("user can request index page", async t => {
  const email = `test.${v4()}@example.com`
  const password = "test1234"

  await User.createWithPassword({ email, password })
  const res = await request(t.context.app).post("/sessions").send(`email=${email}&password=${password}`)

  t.is(res.status, 302)
})
