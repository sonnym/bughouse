import test from "ava"

import { render } from "@vue/server-test-utils"
import Vue, { initRouter } from "@/component"

import Navigation from "~/client/components/navigation"

test("Navigation is an object", t => {
  t.true(Navigation instanceof Object)
})

test("Navigation mounted", t => {
  const router = initRouter()

  const wrapper = render(Navigation, {
    Vue,
    router,
    mocks: { $store: { state: { user: { uuid: "uuid" } } } }
  })

  t.snapshot(wrapper.html())
})

