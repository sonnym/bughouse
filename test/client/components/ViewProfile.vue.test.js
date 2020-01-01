import test from "ava"

import { mount, initRouter } from "@/component"

import ViewProfile from "~/client/components/ViewProfile"

test("ViewProfile snapshot", t => {
  const router = initRouter()

  const wrapper = mount(ViewProfile, {
    router
  })

  t.snapshot(wrapper.html())
})
