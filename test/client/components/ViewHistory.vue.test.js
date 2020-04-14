import test from "ava"

import { mount } from "@vue/test-utils"
import ViewHistory from "~/client/components/ViewHistory"

test("ViewHistory snapshot", async t => {
  const $store = {
    state: {
      query: () => {
        return new Promise((resolve, _reject) => {
          resolve({ data: "" })
        })
      }
    }
  }

  const wrapper = mount(ViewHistory, {
    mocks: { $store }
  })

  await wrapper.vm.$nextTick(() => {
    t.snapshot(wrapper.html())
  })
})
