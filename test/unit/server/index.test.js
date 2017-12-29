import test from "ava"
import { startServer } from "./../../../src/server/index"

test("can be started", async t => {
  await t.notThrows(() => startServer(3456))
})
