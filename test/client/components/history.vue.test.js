import test from "ava"

import Vue from "@/component"
import History from "~/client/components/history"

test.beforeEach("initialize vue router", t => {
  t.context.vm = new Vue({
    render: (h) => h(History)
  }).$mount()
})

test("History is an object", t => {
  t.true(History instanceof Object)
})

test("History mounted", t => {
  t.truthy(t.context.vm.$el)
  t.snapshot(t.context.vm.$el.outerHTML)
})
