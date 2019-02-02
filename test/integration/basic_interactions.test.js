import test from "ava"
import request from "supertest"

import appGenerator from "@/app"

test.beforeEach(t => {
  t.context.app = appGenerator()
})

test("user can request index page", async t => {
  const res = await request(t.context.app).get("/")

  t.is(res.status, 200)
})

test("cookie is present in the response", async t => {
  const res = await request(t.context.app).get("/")

  t.truthy(res.headers['set-cookie'])
})
