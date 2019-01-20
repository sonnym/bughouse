import test from "ava"

import Client from "./../../src/simulation"

test("instantiation", t => {
  new Client()
  t.pass()
})
