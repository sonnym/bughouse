import test from "ava"

import WebSocket from "ws"

import Socket from "./../../../src/client/socket"

test.beforeEach(t => global.WebSocket = WebSocket)

test("constructor", t => {
  new Socket()
  t.pass()
})
