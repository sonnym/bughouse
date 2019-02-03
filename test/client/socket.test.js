import test from "ava"

import WebSocket from "ws"
import { initStore } from "@/component"

import Socket from "~/client/socket"

test.beforeEach(t => global.WebSocket = WebSocket)

test("constructor", t => {
  new Socket(initStore())
  t.pass()
})
