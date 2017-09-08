import test from "ava"

import Vue, { initRouter } from "./../../helpers/component"
import Navigation from "./../../../src/client/components/navigation"

test.beforeEach("initialize vue router", t => {
  const router = initRouter()

  t.context.vm = new Vue({
    router,
    render: (h) => h(Navigation)
  }).$mount()
})

test("Navigation is an object", t => {
  t.true(Navigation instanceof Object)
})

test("Navigation mounted", t => {
  t.truthy(t.context.vm.$el)
})
