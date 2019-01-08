import test from "ava"

import WebSocket from "ws"

import bughouse from "./../../../src/client/bughouse"

test.beforeEach(t => global.WebSocket = WebSocket)

test("function call", t => {
  bughouse()
  t.pass()
})
