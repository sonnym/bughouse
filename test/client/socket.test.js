import test from "ava"

import { initStore } from "@/component"

import Socket from "~/client/socket"

test("constructor", t => {
  new Socket(initStore())
  t.pass()
})
