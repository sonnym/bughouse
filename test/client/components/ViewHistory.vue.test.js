import test from "ava"

import Vuetify from "vuetify"

import { mount } from "@vue/test-utils"
import { initRouter } from "@/component"

import ViewHistory from "~/client/components/ViewHistory"

test("ViewHistory snapshot", async t => {
  const router = initRouter()
  const vuetify = new Vuetify()

  const $store = {
    state: {
      query: () => {
        return new Promise((resolve, _reject) => {
          resolve({ data: { getGame: null } })
        })
      }
    }
  }

  const wrapper = mount(ViewHistory, {
    router,
    vuetify,
    mocks: { $store }
  })

  await wrapper.vm.$nextTick(() => {
    t.snapshot(wrapper.html())
  })
})
