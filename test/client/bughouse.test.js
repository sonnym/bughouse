import test from "ava"
import { stub } from "sinon"

import bughouse from "./../../src/client/bootstrap"

test("function call", t => {
  const app = { $store: { commit: stub() } }
  bughouse.bind(app).call()
  t.pass()
})
