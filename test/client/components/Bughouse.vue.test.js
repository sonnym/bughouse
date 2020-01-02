import test from "ava"

import { mount, initRouter, initStore } from "@/component"

import Bughouse from "~/client/components/Bughouse"

test("Bughouse snapshot", t => {
  const router = initRouter()
  const store = initStore()

  const wrapper = mount(Bughouse, {
    router,
    store
  })

  t.snapshot(wrapper.html())
})
