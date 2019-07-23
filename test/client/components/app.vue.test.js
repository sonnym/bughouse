import test from "ava"

import { render } from "@vue/server-test-utils"
import { initRouter } from "@/component"
import App from "~/client/components/app"

test("App is an object", t => {
  t.true(App instanceof Object)
})

test("App mounted", t => {
  const router = initRouter()
  const $store = {
    state: {
      user: { uuid: "uuid" },
      games: { },
      universe: { }
    }
  }

  const wrapper = render(App, {
    router,
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
