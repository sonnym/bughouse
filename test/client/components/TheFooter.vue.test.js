import test from "ava"

import { mount } from "@/component"
import TheFooter from "~/client/components/TheFooter"

test("TheFooter snapshot", t => {
  const wrapper = mount(TheFooter)

  t.snapshot(wrapper.html())
})
