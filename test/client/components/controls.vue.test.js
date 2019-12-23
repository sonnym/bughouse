import test from "ava"

import { mount } from "@/component"
import Controls from "~/client/components/controls"

test("Controls is an object", t => {
  t.true(Controls instanceof Object)
})

test("Controls snapshot", t => {
  const wrapper = mount(Controls)

  t.snapshot(wrapper.html())
})
