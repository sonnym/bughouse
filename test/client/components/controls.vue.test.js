import test from "ava"
import Controls from "./../../../src/client/components/controls"

test("Controls is an object", t => {
  t.true(Controls instanceof Object)
})
