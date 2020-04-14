import test from "ava"
import { stub } from "sinon"

import { identity } from "ramda"

import bughouse from "./../../src/client/bootstrap"

test("function call", t => {
  window.fetch = identity

  const app = { $store: { commit: stub() } }

  bughouse.bind(app).call()
  t.pass()
})
