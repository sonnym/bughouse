import test from "ava"

import Vue from "./../../helpers/component"
import Signup from "~/client/components/signup"

test("Signup is an object", t => {
  t.true(Signup instanceof Object)
})

test("Signup mounted", t => {
  const vm = new Vue(Signup).$mount()

  t.truthy(vm.$el.outerHTML)
  t.snapshot(vm.$el.outerHTML)
})
