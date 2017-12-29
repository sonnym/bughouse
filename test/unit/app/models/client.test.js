import test from "ava"
import Model from "./../../../../src/app/models/client"

test.beforeEach(t => {
  t.context = new Model()
})

test("attributes after initialization", t => {
  t.is(t.context.clients.length, 0)
  t.is(t.context.waiting.length, 0)
})
