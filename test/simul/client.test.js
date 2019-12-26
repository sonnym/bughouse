import test from "ava"

import Client from "~/simul/client"

test("instantiation", t => {
  new Client()
  t.pass()
})
