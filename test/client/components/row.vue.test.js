import test from "ava"

import { repeat } from "ramda"

import Vue from "./../../helpers/component"
import Row from "./../../../src/client/components/row"

test("Row is an object", t => {
  t.true(Row instanceof Object)
})

test("Row mounted", t => {
  const Constructor = Vue.extend(Row)
  const vm = new Constructor({
    propsData: {
      row: repeat(null, 8)
    }
  }).$mount()

  t.truthy(vm.$el.outerHTML)
  t.snapshot(vm.$el.outerHTML)
})
