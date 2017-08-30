import test from 'ava'
import getLogger from "../../src/server/logger"

test("logger is a singleton", t => {
  t.is(getLogger(), getLogger())
  t.pass()
})

test("logger in development environment has two streams", t => {
  process.env["ENV"] = "development"

  let logger = getLogger()

  t.is(logger.streams.length, 2)
})
