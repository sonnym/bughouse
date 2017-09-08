import test from "ava"

import Vue from "./../../helpers/component"
import Bottom from "./../../../src/client/components/bottom"

test("Bottom is an object", t => {
  t.true(Bottom instanceof Object)
})

test("Bottom mounted", t => {
  const vm = new Vue(Bottom).$mount()
  t.truthy(vm.$el.outerHTML)
})
