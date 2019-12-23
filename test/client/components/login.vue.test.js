import test from "ava"

import { mount, initRouter } from "@/component"
import Login from "~/client/components/login"

test("Login is an object", t => {
  t.true(Login instanceof Object)
})

test("Login snapshot", t => {
  const router = initRouter()

  const wrapper = mount(Login, {
    router
  })

  t.snapshot(wrapper.html())
})
