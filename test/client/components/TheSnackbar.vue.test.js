import test from "ava"

import { mount, initStore } from "@/component"

import TheSnackbar from "~/client/components/TheSnackbar"

test("TheSnackbar snapshot", t => {
  const store = initStore()

  const wrapper = mount(TheSnackbar, {
    store
  })

  t.snapshot(wrapper.html())
})


