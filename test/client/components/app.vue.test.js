import test from "ava"
import App from "./../../../src/client/components/app"

test("App is an object", t => {
  t.true(App instanceof Object)
})
