import test from "ava"

import { mount, initRouter } from "@/component"
import ViewLeaderboard from "~/client/components/ViewLeaderboard"

test("ViewLeaderboard snapshot", t => {
  const $store = {
    state: {
      fetch: () => {
        return new Promise((resolve, _reject) => {
          resolve({ json: () => ([]) })
        })
      }
    }
  }

  const router = initRouter()

  const wrapper = mount(ViewLeaderboard, {
    router,
    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
