import test from "ava"

import Vue, { initRouter } from "./../../helpers/component"
import Login from "~/client/components/login"

test.beforeEach("initialize vue router", t => {
  const router = initRouter()

  t.context.vm = new Vue({
    router,
    render: (h) => h(Login)
  }).$mount()
})

test("Login is an object", t => {
  t.true(Login instanceof Object)
})

test("Login mounted", t => {
  t.truthy(t.context.vm.$el.outerHTML)
  t.snapshot(t.context.vm.$el.outerHTML)
})
