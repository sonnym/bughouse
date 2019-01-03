import test from "ava"
import request from "supertest"

import { v4 } from "uuid"

import app from "./../helpers/app"
import User from "./../../src/app/models/user"

test("user can request index page", async t => {
  const email = `test.${v4()}@example.com`
  const password = "test1234"

  await User.createWithPassword({ email, password })
  const res = await request(app).post("/sessions").send(`email=${email}&password=${password}`)

  t.is(res.status, 302)
})
