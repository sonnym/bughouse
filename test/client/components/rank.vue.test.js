import test from "ava"

import { repeat } from "ramda"

import { mount } from "@/component"
import Rank from "~/client/components/rank"

test("Rank snapshot", t => {
  const wrapper = mount(Rank, {
    propsData: {
      row: repeat(null, 8)
    }
  })

  t.snapshot(wrapper.html())
})
