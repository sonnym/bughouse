import test from "ava"

import { mount, initRouter } from "@/component"

import Navigation from "~/client/components/navigation"

test("Navigation is an object", t => {
  t.true(Navigation instanceof Object)
})

test("Navigation snapshot", t => {
  const router = initRouter()
  const wrapper = mount(Navigation, {
    router,
    mocks: { $store: { state: { user: { uuid: "uuid" } } } }
  })

  t.snapshot(wrapper.html())
})

