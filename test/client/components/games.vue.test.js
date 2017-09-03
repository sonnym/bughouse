import test from "ava"
import Games from "./../../../src/client/components/games"

test("Games is an object", t => {
  t.true(Games instanceof Object)
})
