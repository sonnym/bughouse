import test from "ava"

import { mount } from "@/component"
import Footer from "~/client/components/footer"

test("Footer is an object", t => {
  t.true(Footer instanceof Object)
})

test("Footer snapshot", t => {
  const wrapper = mount(Footer)

  t.snapshot(wrapper.html())
})
