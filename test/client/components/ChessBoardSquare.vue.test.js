import test from "ava"

import { Chess } from "chess.js"

import { mount } from "@/component"
import ChessBoardSquare from "~/client/components/ChessBoardSquare"

const chess = new Chess()

test("ChessBoardSquare snapshot mounted with a piece", t => {
  const getters = { "player/moveable": () => { } }
  const $store = { getters }

  const wrapper = mount(ChessBoardSquare, {
    propsData: {
      piece: { type: chess.PAWN, color: chess.BLACK }
    },

    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})

test("ChessBoardSquare snapshot mounted without a piece", t => {
  const getters = { "player/moveable": () => { } }
  const $store = { getters }

  const wrapper = mount(ChessBoardSquare, {
    propsData: {
      piece: null
    },

    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})
