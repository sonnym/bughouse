import test from "ava"

import { mount } from "@/component"
import ViewSignup from "~/client/components/ViewSignup"

test("ViewSignup snapshot", t => {
  const wrapper = mount(ViewSignup)

  t.snapshot(wrapper.html())
})
