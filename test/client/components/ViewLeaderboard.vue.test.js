import test from "ava"

import { mount, initRouter } from "@/component"
import ViewLeaderboard from "~/client/components/ViewLeaderboard"

test("ViewLeaderboard snapshot", t => {
  global.fetch = () => {
    return new Promise((resolve, _reject) => {
      resolve({ json: () => ([]) })
    })
  }

  const router = initRouter()

  const wrapper = mount(ViewLeaderboard, {
    router
  })

  t.snapshot(wrapper.html())
})
