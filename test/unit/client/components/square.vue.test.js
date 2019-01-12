import test from "ava"

import Vue from "./../../../helpers/component"
import Square from "./../../../../src/client/components/square"

test("Square is an object", t => {
  t.true(Square instanceof Object)
})

test("Square mounted", t => {
  const Constructor = Vue.extend(Square)
  const vm = new Constructor({
    propsData: {
      piece: "K"
    }
  }).$mount()

  t.truthy(vm.$el.outerHTML)
})
