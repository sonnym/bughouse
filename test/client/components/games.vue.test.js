import test from "ava"

import { mount, initStore } from "@/component"

import Games from "~/client/components/games"

test("Games snapshot", t => {
  const store = initStore()

  const wrapper = mount(Games, {
    store
  })

  t.snapshot(wrapper.html())
})
