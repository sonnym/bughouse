import test from "ava"

import Vue from "./../../../helpers/component"
import Controls from "./../../../../src/client/components/controls"

test("Controls is an object", t => {
  t.true(Controls instanceof Object)
})

test("Controls mounted", t => {
  const vm = new Vue(Controls).$mount()
  t.truthy(vm.$el.outerHTML)
})
