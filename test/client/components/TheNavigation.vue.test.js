import test from "ava"

import { mount, initRouter } from "@/component"

import TheNavigation from "~/client/components/TheNavigation"

test("TheNavigation snapshot", t => {
  const $store = {
    getters: {
      loggedIn: true,
      uuid: "uuid",

      loggedOut: false,
      displayName: ""
    }
  }

  const router = initRouter()
  const wrapper = mount(TheNavigation, {
    router,
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})

