import test from "ava"

import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN } from "~/share/constants/chess"
import { mount, initRouter } from "@/component"

import ChessReserve from "~/client/components/ChessReserve"

test("ChessReserve snapshot white", t => {
  const router = initRouter()

  const wrapper = mount(ChessReserve, {
    router,
    propsData: {
      color: "w",

      reserve: {
        [PAWN]: 1, [KNIGHT]: 2, [BISHOP]: 3, [ROOK]: 4, [QUEEN]: 5
      }
    }
  })

  t.snapshot(wrapper.html())
})

test("ChessReserve snapshot black", t => {
  const router = initRouter()

  const wrapper = mount(ChessReserve, {
    router,
    propsData: {
      color: "b",

      reserve: {
        [PAWN]: 1, [KNIGHT]: 2, [BISHOP]: 3, [ROOK]: 4, [QUEEN]: 5
      }
    }
  })

  t.snapshot(wrapper.html())
})

