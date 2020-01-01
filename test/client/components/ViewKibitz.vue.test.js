import test from "ava"

import { mount, initStore } from "@/component"

import ViewKibitz from "~/client/components/ViewKibitz"

test("ViewKibitz snapshot", t => {
  const store = initStore()

  const wrapper = mount(ViewKibitz, {
    store
  })

  t.snapshot(wrapper.html())
})
