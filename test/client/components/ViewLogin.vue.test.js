import test from "ava"

import { mount, initRouter } from "@/component"
import ViewLogin from "~/client/components/ViewLogin"

test("ViewLogin snapshot", t => {
  const router = initRouter()

  const wrapper = mount(ViewLogin, {
    router
  })

  t.snapshot(wrapper.html())
})
