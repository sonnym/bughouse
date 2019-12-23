import test from "ava"

import { mount, initStore } from "@/component"

import Games from "~/client/components/games"

test.beforeEach("initialize vue", t => {

})

test("Games is an object", t => {
  t.true(Games instanceof Object)
})

test("Games snapshot", t => {
  const store = initStore()

  const wrapper = mount(Games, {
    store
  })

  t.snapshot(wrapper.html())
})
