import test from "ava"

import { Chess } from "chess.js"

import { mount } from "@/component"
import Square from "~/client/components/square"

const chess = new Chess()

test("Square is an object", t => {
  t.true(Square instanceof Object)
})

test("Square snapshot mounted with a piece", t => {
  const wrapper = mount(Square, {
    propsData: {
      piece: { type: chess.PAWN, color: chess.BLACK }
    }
  })

  t.snapshot(wrapper.html())
})

test("Square snapshot mounted without a piece", t => {
  const wrapper = mount(Square, {
    propsData: {
      piece: null
    }
  })

  t.snapshot(wrapper.html())
})
