import test from "ava"

import { mount, initRouter } from "@/component"

import Profile from "~/client/components/profile"

test("Profile snapshot", t => {
  const router = initRouter()

  const wrapper = mount(Profile, {
    router
  })

  t.snapshot(wrapper.html())
})
