import test from "ava"

import { mount, initRouter } from "@/component"

import { v4 } from "uuid"

import ViewLogin from "~/client/components/ViewLogin"

test("ViewLogin snapshot", t => {
  const router = initRouter()

  const wrapper = mount(ViewLogin, {
    router
  })

  t.snapshot(wrapper.html())
})

test("ViewLogin: with unsuccessful response", async t => {
  t.plan(6)

  const email = `${v4()}@example.com`
  const password = v4()

  const router = initRouter()
  const $store = {
    state: {
      fetch: (path, config) => {
        t.is(path, "/sessions")
        t.is(config.method, "POST")
        t.is(config.body, JSON.stringify({ email, password }))

        return { status: 401 }
      }
    },

    commit: (type, payload) => {
      t.is(type, "message")

      t.is(payload.type, "error")
      t.is(payload.text, "Invalid email or password. Please try again.")
    }
  }

  const wrapper = mount(ViewLogin, {
    router,
    mocks: { $store }
  })

  wrapper.setData({ email, password })

  await wrapper.vm.submit()
  // await wrapper.find(".v-btn").trigger("click") // TODO
})
