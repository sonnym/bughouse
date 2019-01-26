import test from "ava"

import Vue from "./../../helpers/component"
import Board from "./../../../src/client/components/board"

test("Board is an object", t => {
  t.true(Board instanceof Object)
})

test("Board mounted", t => {
  const Constructor = Vue.extend(Board)
  const vm = new Constructor({
    propsData: {
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    }
  }).$mount()

  t.log(vm.$el)
  t.truthy(vm.$el.outerHTML)
})
