import test from "ava"

import { mount } from "@/component"
import Footer from "~/client/components/footer"

test("Footer snapshot", t => {
  const wrapper = mount(Footer)

  t.snapshot(wrapper.html())
})
