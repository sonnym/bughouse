import test from "ava"

import { Chess } from "chess.js"

import { mount } from "@/component"
import ChessPiece from "~/client/components/ChessPiece"

const chess = new Chess()

test("ChessPiece snapshot", t => {
  const getters = { "player/moveable": () => { } }
  const $store = { getters }

  const wrapper = mount(ChessPiece, {
    propsData: {
      piece: { type: chess.PAWN, color: chess.BLACK }
    },

    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
