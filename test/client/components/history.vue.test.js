import test from "ava"

import { mount } from "@/component"
import History from "~/client/components/history"

test("History snapshot", t => {
  const wrapper = mount(History)

  t.snapshot(wrapper.html())
})
