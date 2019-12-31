import test from "ava"

import { mount, initStore } from "@/component"

import ChessGame from "~/client/components/ChessGame"

const store = initStore()

test("ChessGame snapshot mounted with a ChessGame", t => {
  const wrapper = mount(ChessGame, {
    stubs: ["router-link"],
    store,
    propsData: {
      ChessGame: {
        whiteUser: { uuid: "whiteUser", displayName: "whiteUser" },
        blackUser: { uuid: "blackUser", displayName: "blackUser" },
        currentPosition: {
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        }
      }
    }
  })

  t.snapshot(wrapper.html())
})

test("ChessGame snapshot mounted without a ChessGame", t => {
  const wrapper = mount(ChessGame, {
    store,
    stubs: ["router-link"],
    propsData: {
      ChessGame: null
    }
  })

  t.snapshot(wrapper.html())
})
