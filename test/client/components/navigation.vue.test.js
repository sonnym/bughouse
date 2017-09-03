import test from "ava"
import Navigation from "./../../../src/client/components/navigation"

test("Navigation is an object", t => {
  t.true(Navigation instanceof Object)
})
