import test from "ava"

import { mount } from "@/component"

import Header from "~/client/components/header"

test("Header snapshot", t => {
  const $store = {
    state: {
      universe: { }
    }
  }

  const wrapper = mount(Header, {
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
