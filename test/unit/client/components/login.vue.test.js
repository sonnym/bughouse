import test from "ava"

import Vue from "./../../../helpers/component"
import Login from "./../../../../src/client/components/login"

test("Login is an object", t => {
  t.true(Login instanceof Object)
})

test("Login mounted", t => {
  const vm = new Vue(Login).$mount()
  t.truthy(vm.$el.outerHTML)
})
