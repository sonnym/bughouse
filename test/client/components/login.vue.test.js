import test from "ava"
import "./../../helpers/component"

import Login from "./../../../src/client/components/login"

test("Login is an object", t => {
  t.true(Login instanceof Object)
})
