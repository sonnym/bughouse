import test from "ava"

import Vue from "./../../helpers/component"
import Games from "./../../../src/client/components/games"

test("Games is an object", t => {
  t.true(Games instanceof Object)
})

test("Games mounted", t => {
  const vm = new Vue(Games).$mount()
  t.truthy(vm.$el.outerHTML)
})
