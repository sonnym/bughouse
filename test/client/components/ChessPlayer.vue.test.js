import test from "ava"

import { mount, initRouter } from "@/component"

import ChessPlayer from "~/client/components/ChessPlayer"

test("ChessPlayer snapshot (top,white)", t => {
  const router = initRouter()

  const wrapper = mount(ChessPlayer, {
    router,
    propsData: {
      user: {
        displayName: "chu2awa0jae6keiZughedahPhaesohf7",
        uuid: "ged8oor8aimikoo2eFaen0eit0oodohK"
      }
    }
  })

  t.snapshot(wrapper.html())
})

test("ChessPlayer snapshot (bottom,black)", t => {
  const router = initRouter()

  const wrapper = mount(ChessPlayer, {
    router,
    propsData: {
      user: {
        displayName: "LaWeiZah5Aiqu1LefahSh8iek4maisah",
        uuid: "odooyuashai4Joofiechae3ek6huawie"
      }
    }
  })

  t.snapshot(wrapper.html())
})
