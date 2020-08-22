import test from "ava"

import { mock } from "sinon"

import { mount } from "@/component"
import ChessBoard from "~/client/components/ChessBoard"

test("ChessBoard snapshot", t => {
  const getters = { "player/moveable": () => { } }
  const $store = { getters }

  const wrapper = mount(ChessBoard, {
    propsData: {
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    },

    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})

test("ChessBoard play functionality", t => {
  const dispatch = mock()
  const getters = { "player/moveable": () => { } }

  const $store = { dispatch, getters }

  const wrapper = mount(ChessBoard, {
    propsData: {
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    },

    mocks: { $store }
  })

  move("e2", "e4")

  t.true(dispatch.calledOnce)
  t.true(dispatch.calledOnceWith("player/move", {
    from: "e2",
    to: "e4"
  }))

  function move(from, to) {
    const dataTransfer = (() => {
      let data = null

      return {
        setData: (_type, theData) => { data = theData },
        getData: (_type) => { return data },
      }
    })()

    t.log(dataTransfer)

    wrapper.get(`[data-coords="${from}"] p`).trigger("dragstart", { dataTransfer })
    wrapper.get(`[data-coords="${to}"]`).trigger("drop", { dataTransfer })
  }
})
