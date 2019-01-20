import test from "ava"

import WebSocket from "ws"
import { initStore } from "./../helpers/component"

/*
import Socket from "./../../../src/client/socket"
*/

test.beforeEach(t => global.WebSocket = WebSocket)

test.skip("constructor", t => {
  new Socket(initStore())
  t.pass()
})
