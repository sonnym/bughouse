import test from "ava"

import Vue from "./../../helpers/component"
import Row from "./../../../src/client/components/row"

test("Row is an object", t => {
  t.true(Row instanceof Object)
})

test("Row mounted", t => {
  const vm = new Vue(Row).$mount()
  t.truthy(vm.$el.outerHTML)
})
