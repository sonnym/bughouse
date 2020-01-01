import test from "ava"

import { mount } from "@/component"
import TheControls from "~/client/components/TheControls"

test("TheControls snapshot", t => {
  const store = { }
  const wrapper = mount(TheControls, {
    store
  })

  t.snapshot(wrapper.html())
})
