import test from "ava"

import { mount } from "@/component"
import ChessBoard from "~/client/components/ChessBoard"

test("ChessBoard snapshot", t => {
  const wrapper = mount(ChessBoard, {
    propsData: {
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    }
  })

  t.snapshot(wrapper.html())
})
