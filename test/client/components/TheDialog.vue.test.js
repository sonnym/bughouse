import test from "ava"

import { shallowMount } from "@/component"

import TheDialog from "~/client/components/TheDialog"

test("TheDialog: when player is not waiting", t => {
  const $store = {
    getters: {
      "player/waiting": false
    }
  }

  const wrapper = shallowMount(TheDialog, {
    mocks: { $store },
    attachToDocument: true
  })

  t.snapshot(wrapper.html())
})

test("TheDialog: when player is waiting", t => {
  const $store = {
    getters: {
      "player/waiting": true
    }
  }

  const wrapper = shallowMount(TheDialog, {
    mocks: { $store },
    attachToDocument: true
  })

  t.snapshot(wrapper.html())
})
