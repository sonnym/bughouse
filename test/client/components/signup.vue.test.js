import test from "ava"

import { mount } from "@/component"
import Signup from "~/client/components/signup"

test("Signup snapshot", t => {
  const wrapper = mount(Signup)

  t.snapshot(wrapper.html())
})
