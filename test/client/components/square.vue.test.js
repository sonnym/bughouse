import test from "ava"

import { Chess } from "chess.js"

import Vue from "./../../helpers/component"
import Square from "./../../../src/client/components/square"

const chess = new Chess()

test("Square is an object", t => {
  t.true(Square instanceof Object)
})

test("Square mounted with a piece", t => {
  const Constructor = Vue.extend(Square)
  const vm = new Constructor({
    propsData: {
      piece: { type: chess.PAWN, color: chess.BLACK }
    }
  }).$mount()

  t.truthy(vm.$el.outerHTML)
  t.snapshot(vm.$el.outerHTML)
})

test("Square mounted without a piece", t => {
  const Constructor = Vue.extend(Square)
  const vm = new Constructor({
    propsData: {
      piece: null
    }
  }).$mount()

  t.truthy(vm.$el.outerHTML)
  t.snapshot(vm.$el.outerHTML)
})
