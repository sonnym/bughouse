import test from "ava"
import "./../../helpers/component"

import Top from "./../../../src/client/components/top"

test("Top is an object", t => {
  t.true(Top instanceof Object)
})