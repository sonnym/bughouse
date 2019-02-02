import test from "ava"

import Vue from "./../../helpers/component"
import Footer from "~/client/components/footer"

test.beforeEach("initialize vue router", t => {
  t.context.vm = new Vue({
    render: (h) => h(Footer)
  }).$mount()
})

test("Footer is an object", t => {
  t.true(Footer instanceof Object)
})

test("Footer mounted", t => {
  t.truthy(t.context.vm.$el)
  t.snapshot(t.context.vm.$el.outerHTML)
})
