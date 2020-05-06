import test from "ava"

import { mount } from "@/component"
import TheControlsKibitzing from "~/client/components/TheControlsKibitzing"

test("TheControlsKibitzing snapshot", t => {
  const store = { }
  const wrapper = mount(TheControlsKibitzing, {
    store
  })

  t.snapshot(wrapper.html())
})
