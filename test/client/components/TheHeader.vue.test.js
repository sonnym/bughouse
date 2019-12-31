import test from "ava"

import { mount } from "@/component"

import TheHeader from "~/client/components/TheHeader"

test("TheHeader snapshot", t => {
  const $store = {
    state: {
      universe: { }
    }
  }

  const wrapper = mount(TheHeader, {
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
