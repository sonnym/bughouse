import test from "ava"

import { mount } from "@/component"

import Game from "~/client/components/game"

test("Game is an object", t => {
  t.true(Game instanceof Object)
})

test("Game snapshot mounted with a game", t => {
  const wrapper = mount(Game, {
    stubs: ["router-link"],
    propsData: {
      game: {
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

test("Game snapshot mounted without a game", t => {
  const wrapper = mount(Game, {
    propsData: {
      game: null
    }
  })

  t.snapshot(wrapper.html())
})
