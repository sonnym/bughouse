import test from "ava"
import request from "supertest"

import app from "./../../src/app/index"

test("user can request index page", async t => {
  const res = await request(app).get("/")

  t.is(res.status, 200)
})
