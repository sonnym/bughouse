import test from "ava"

import { shallowMount } from "@vue/test-utils"

import Game from "~/client/components/game"

test("Game is an object", t => {
  t.true(Game instanceof Object)
})

test("Game mounted with a game", t => {
  const wrapper = shallowMount(Game, {
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

  t.truthy(wrapper.element.outerHTML)
  t.snapshot(wrapper.element.outerHTML)
})

test("Game mounted without a game", t => {
  const wrapper = shallowMount(Game, {
    propsData: {
      game: null
    }
  })

  t.truthy(wrapper.element.outerHTML)
  t.snapshot(wrapper.element.outerHTML)
})
