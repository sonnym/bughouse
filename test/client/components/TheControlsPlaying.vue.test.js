import test from "ava"

import { mount } from "@/component"
import TheControlsPlaying from "~/client/components/TheControlsPlaying"

test("TheControlsPlaying snapshot", t => {
  const wrapper = mount(TheControlsPlaying)

  t.snapshot(wrapper.html())
})

