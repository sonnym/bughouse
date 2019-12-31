import test from "ava"

import { mount, initRouter } from "@/component"

import Bughouse from "~/client/components/Bughouse"

test("Bughouse snapshot", t => {
  const router = initRouter()
  const $store = {
    state: {
      user: { uuid: "uuid" },
      games: { },
      universe: { }
    }
  }

  const wrapper = mount(Bughouse, {
    router,
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
