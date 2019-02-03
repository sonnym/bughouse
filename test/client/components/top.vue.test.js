import test from "ava"

import Vue from "@/component"
import Header from "~/client/components/header"

test.beforeEach("initialize vue router", t => {
  t.context.vm = new Vue({
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
