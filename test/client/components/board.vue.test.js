import test from "ava"

import { mount } from "@/component"
import Board from "~/client/components/board"

test("Board snapshot", t => {
  const wrapper = mount(Board, {
    propsData: {
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    }
  })

  t.snapshot(wrapper.html())
})
