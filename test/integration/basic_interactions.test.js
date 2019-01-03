import test from "ava"
import request from "supertest"

import app from "./../helpers/app"

test("user can request index page", async t => {
  const res = await request(app).get("/")

  t.is(res.status, 200)
})

test("cookie is present in the response", async t => {
  const res = await request(app).get("/")

  t.truthy(res.headers['set-cookie'])
})
