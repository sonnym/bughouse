import test from "ava"

import Vue, { initStore } from "./../../helpers/component"
import Header from "~/client/components/header"

test.beforeEach("initialize vue router", t => {
  const store = initStore()

  t.context.vm = new Vue({
    store,
    render: (h) => h(Header)
  }).$mount()
})

test("Header is an object", t => {
  t.true(Header instanceof Object)
})

test("Header mounted", t => {
  t.truthy(t.context.vm.$el)
  t.snapshot(t.context.vm.$el.outerHTML)
})
