import test from "ava"

import Vue from "@/component"
import Player from "~/client/components/player"

test.beforeEach("initialize vue router", t => {
  t.context.vm = new Vue({
    render: (h) => h(Player)
  }).$mount()
})

test("Player is an object", t => {
  t.true(Player instanceof Object)
})

test("Player mounted", t => {
  t.truthy(t.context.vm.$el)
  t.snapshot(t.context.vm.$el.outerHTML)
})
