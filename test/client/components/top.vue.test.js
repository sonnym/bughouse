import test from "ava"

import { mount } from "@vue/test-utils"
import Vue from "@/component"

import Header from "~/client/components/header"

test("Header is an object", t => {
  t.true(Header instanceof Object)
})

test("Header mounted", t => {
  const $store = {
    state: {
      universe: { }
    }
  }

  const wrapper = mount(Header, {
    Vue,
    mocks: { $store }
  })

  t.snapshot(wrapper.element.outerHTML)
})
