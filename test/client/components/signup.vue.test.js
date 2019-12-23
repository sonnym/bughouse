import test from "ava"

import { mount } from "@/component"
import Signup from "~/client/components/signup"

test("Signup is an object", t => {
  t.true(Signup instanceof Object)
})

test("Signup snapshot", t => {
  const wrapper = mount(Signup)

  t.snapshot(wrapper.html())
})
