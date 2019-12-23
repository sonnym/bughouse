import test from "ava"

import { mount } from "@/component"
import Player from "~/client/components/player"

test("Player is an object", t => {
  t.true(Player instanceof Object)
})

test("Player snapshot", t => {
  const wrapper = mount(Player)

  t.snapshot(wrapper.html())
})
