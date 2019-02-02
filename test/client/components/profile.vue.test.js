import test from "ava"

import Vue from "./../../helpers/component"
import Profile from "~/client/components/profile"

test.beforeEach("initialize vue router", t => {
  t.context.vm = new Vue({
    render: (h) => h(Profile)
  }).$mount()
})

test("Profile is an object", t => {
  t.true(Profile instanceof Object)
})

test("Profile mounted", t => {
  t.truthy(t.context.vm.$el)
  t.snapshot(t.context.vm.$el.outerHTML)
})
