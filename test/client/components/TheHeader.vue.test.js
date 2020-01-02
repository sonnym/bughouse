import test from "ava"

import { mount, initRouter } from "@/component"

import TheHeader from "~/client/components/TheHeader"

test("TheHeader snapshot", t => {
  const router = initRouter()
  const $store = {
    state: {
      universe: { }
    }
  }

  const wrapper = mount(TheHeader, {
    router,
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
