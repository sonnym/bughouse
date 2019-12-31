import test from "ava"

import { mount } from "@/component"
import ChessPlayer from "~/client/components/ChessPlayer"

test("ChessPlayer snapshot", t => {
  const wrapper = mount(ChessPlayer)

  t.snapshot(wrapper.html())
})
