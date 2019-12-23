import test from "ava"

import { mount, initRouter } from "@/component"

import App from "~/client/components/app"

test("App snapshot", t => {
  const router = initRouter()
  const $store = {
    state: {
      user: { uuid: "uuid" },
      games: { },
      universe: { }
    }
  }

  const wrapper = mount(App, {
    router,
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
