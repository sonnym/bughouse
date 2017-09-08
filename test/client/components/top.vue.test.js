import test from "ava"

import Vue, { initRouter } from "./../../helpers/component"
import Top from "./../../../src/client/components/top"

test.beforeEach("initialize vue router", t => {
  const router = initRouter()

  t.context.vm = new Vue({
    router,
    render: (h) => h(Top)
  }).$mount()
})

test("Top is an object", t => {
  t.true(Top instanceof Object)
})

test("Top mounted", t => {
  t.truthy(t.context.vm.$el)
})
