import test from "ava"

import { mount, initRouter, initStore } from "@/component"

import ViewKibitz from "~/client/components/ViewKibitz"

test("ViewKibitz snapshot", t => {
  const router = initRouter()
  const store = initStore()

  const wrapper = mount(ViewKibitz, {
    router,
    store
  })

  t.snapshot(wrapper.html())
})
