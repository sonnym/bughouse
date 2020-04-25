import test from "ava"

import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN } from "~/share/constants/chess"
import { mount, initRouter } from "@/component"

import ChessPlayer from "~/client/components/ChessPlayer"

test("ChessPlayer snapshot (top,white)", t => {
  const router = initRouter()

  const wrapper = mount(ChessPlayer, {
    router,
    propsData: {
      context: "top",

      user: {
        displayName: "chu2awa0jae6keiZughedahPhaesohf7",
        uuid: "ged8oor8aimikoo2eFaen0eit0oodohK"
      },

      color: "w",

      reserve: {
        [PAWN]: 1, [KNIGHT]: 2, [BISHOP]: 3, [ROOK]: 4, [QUEEN]: 5
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
      context: "bottom",

      user: {
        displayName: "LaWeiZah5Aiqu1LefahSh8iek4maisah",
        uuid: "odooyuashai4Joofiechae3ek6huawie"
      },

      color: "b",

      reserve: {
        [PAWN]: 1, [KNIGHT]: 2, [BISHOP]: 3, [ROOK]: 4, [QUEEN]: 5
      }
    }
  })

  t.snapshot(wrapper.html())
})
