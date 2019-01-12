import test from "ava"
import { stub } from "sinon"

import WebSocket from "ws"

import bughouse from "./../../../src/client/bughouse"

test.beforeEach(t => global.WebSocket = WebSocket)

test("function call", t => {
  const app = { $store: { commit: stub() } }
  bughouse.bind(app).call()
  t.pass()
})
