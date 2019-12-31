import test from "ava"

import { mount } from "@/component"
import TheControls from "~/client/components/TheControls"

test("TheControls snapshot", t => {
  const wrapper = mount(TheControls)

  t.snapshot(wrapper.html())
})
