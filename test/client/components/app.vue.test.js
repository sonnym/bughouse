import test from "ava"

import Vue, { initRouter } from "./../../helpers/component"
import App from "./../../../src/client/components/app"

test.beforeEach("initialize vue router", t => {
  const router = initRouter()

  t.context.vm = new Vue({
    router,
    render: (h) => h(App)
  }).$mount()
})

test("App is an object", t => {
  t.true(App instanceof Object)
})

test("App mounted", t => {
  t.truthy(t.context.vm.$el)
})
