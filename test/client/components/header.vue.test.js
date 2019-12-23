import test from "ava"

import { mount } from "@/component"

import Header from "~/client/components/header"

test("Header is an object", t => {
  t.true(Header instanceof Object)
})

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
