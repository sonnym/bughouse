import test from "ava"

import { mount, initRouter } from "@/component"

import TheNavigation from "~/client/components/TheNavigation"

test("TheNavigation snapshot", t => {
  const router = initRouter()
  const wrapper = mount(TheNavigation, {
    router,
    mocks: { $store: { state: { user: { uuid: "uuid" } } } }
  })

  t.snapshot(wrapper.html())
})

