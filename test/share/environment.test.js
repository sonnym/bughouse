import test from "ava"
import { environment } from "./../../src/share/environment"

test("environment is development by default", t => {
  t.is(environment, "development")
  t.pass()
})
