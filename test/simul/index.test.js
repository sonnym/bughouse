import test from "ava"

import Client from "~/simul/index"

test("instantiation", t => {
  new Client()
  t.pass()
})
