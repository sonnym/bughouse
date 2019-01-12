import test from "ava"

import Vue, { initStore } from "./../../../helpers/component"

import Games from "./../../../../src/client/components/games"

test.beforeEach("initialize vue", t => {
  const store = initStore()

  t.context.vm = new Vue({
    store,
    render: (h) => h(Games)
  }).$mount()
})

test("Games is an object", t => {
  t.true(Games instanceof Object)
})

test("Games mounted", t => {
  t.truthy(t.context.vm.$el.outerHTML)
})
