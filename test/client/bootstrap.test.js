import test from "ava"
import { stub } from "sinon"

import { identity } from "ramda"

// import bootstrap from "~/client/bootstrap"

test.failing("function call", t => {
  window.fetch = identity

  const app = { $store: { commit: stub() } }

  bootstrap.bind(app).call()
  t.pass()
})
