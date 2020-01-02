import test from "ava"

import { mount, initRouter } from "@/component"
import ChessPlayer from "~/client/components/ChessPlayer"

test("ChessPlayer snapshot", t => {
  const router = initRouter()
  const wrapper = mount(ChessPlayer, {
    router
  })

  t.snapshot(wrapper.html())
})
