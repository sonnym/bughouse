import test from "ava"

import logger from "./../../../src/client/logger"

test("logging", t => {
  logger("foo bar")
  t.pass()
})
