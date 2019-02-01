import test from "ava"

import Vue from "./../../helpers/component"
import Game from "~/client/components/game"

test("Game is an object", t => {
  t.true(Game instanceof Object)
})

test("Game mounted with a game", t => {
  const Constructor = Vue.extend(Game)
  const vm = new Constructor({
    propsData: {
      game: {
        currentPosition: {
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        }
      }
    }
  }).$mount()

  t.truthy(vm.$el.outerHTML)
  t.snapshot(vm.$el.outerHTML)
})

test("Game mounted without a game", t => {
  const Constructor = Vue.extend(Game)
  const vm = new Constructor({
    propsData: {
      game: null
    }
  }).$mount()

  t.truthy(vm.$el.outerHTML)
  t.snapshot(vm.$el.outerHTML)
})
