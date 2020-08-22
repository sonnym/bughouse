import test from "ava"

import { mount } from "@/component"
import TheControlsKibitzing from "~/client/components/TheControlsKibitzing"

test("TheControlsKibitzing snapshot: when logged out", t => {
  const $store = {
    getters: {
      loggedId: false
    }
  }

  const wrapper = mount(TheControlsKibitzing, {
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})

test("TheControlsKibitzing snapshot: when logged in", t => {
  const $store = {
    getters: {
      loggedId: true
    }
  }

  const wrapper = mount(TheControlsKibitzing, {
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
