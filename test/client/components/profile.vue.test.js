import test from "ava"

import { render } from '@vue/server-test-utils'
import Vue, { initRouter } from "@/component"

import Profile from "~/client/components/profile"

test("Profile is an object", t => {
  t.true(Profile instanceof Object)
})

test("Profile mounted", t => {
  const router = initRouter()

  const wrapper = render(Profile, {
    Vue,
    router
  })

  t.snapshot(wrapper.html())
})
