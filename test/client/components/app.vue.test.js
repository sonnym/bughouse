import test from "ava"

import Vue, { initRouter, initStore } from "@/component"
import App from "~/client/components/app"

test.beforeEach("initialize vue router", t => {
  const router = initRouter()
  const store = initStore()

  t.context.vm = new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount()
})

test("App is an object", t => {
  t.true(App instanceof Object)
})

test("App mounted", t => {
  t.truthy(t.context.vm.$el)
  t.snapshot(t.context.vm.$el.outerHTML)
})
