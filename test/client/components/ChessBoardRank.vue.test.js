import test from "ava"

import { repeat } from "ramda"

import { mount } from "@/component"
import ChessBoardRank from "~/client/components/ChessBoardRank"

test("ChessBoardRank snapshot", t => {
  const wrapper = mount(ChessBoardRank, {
    propsData: {
      row: repeat(null, 8)
    }
  })

  t.snapshot(wrapper.html())
})
