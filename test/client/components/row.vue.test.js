import test from "ava"

import { repeat } from "ramda"

import { mount } from "@/component"
import Row from "~/client/components/row"

test("Row snapshot", t => {
  const wrapper = mount(Row, {
    propsData: {
      row: repeat(null, 8)
    }
  })

  t.snapshot(wrapper.html())
})
