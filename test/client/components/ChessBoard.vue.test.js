import test from "ava"

import { mock } from "sinon"

import { mount } from "@/component"
import ChessBoard from "~/client/components/ChessBoard"

test("ChessBoard snapshot", t => {
  const wrapper = mount(ChessBoard, {
    propsData: {
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    }
  })

  t.snapshot(wrapper.html())
})

test.only("ChessBoard play functionality", t => {
  const dispatch = mock()
  const $store = { dispatch }

  const wrapper = mount(ChessBoard, {
    propsData: {
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    },

    mocks: { $store }
  })

  move("e2", "e4")

  t.log(dispatch.getCalls())

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
        clearData: mock()
      }
    })()

    t.log(dataTransfer)

    wrapper.get(`[data-coords="${from}"] p`).trigger("dragstart", { dataTransfer })
    wrapper.get(`[data-coords="${to}"]`).trigger("drop", { dataTransfer })
  }
})
