import test from "ava"

import { mount } from "@/component"
import ViewHistory from "~/client/components/ViewHistory"

test("ViewHistory snapshot", t => {
  const wrapper = mount(ViewHistory)

  t.snapshot(wrapper.html())
})
