import test from "ava"
import "./../../helpers/component"

import Bottom from "./../../../src/client/components/bottom"

test("Bottom is an object", t => {
  t.true(Bottom instanceof Object)
})