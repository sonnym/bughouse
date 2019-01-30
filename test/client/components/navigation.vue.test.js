import test from "ava"

import Vue, { initRouter, initStore } from "./../../helpers/component"
import Navigation from "~/client/components/navigation"

test.beforeEach("initialize vue", t => {
  const router = initRouter()
  const store = initStore()

  t.context.vm = new Vue({
    router,
    store,
    render: (h) => h(Navigation)
  }).$mount()
})

test("Navigation is an object", t => {
  t.true(Navigation instanceof Object)
})

test("Navigation mounted", t => {
  t.truthy(t.context.vm.$el.outerHTML)
  t.snapshot(t.context.vm.$el.outerHTML)
})

