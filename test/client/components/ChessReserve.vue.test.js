import test from "ava"

import Vue from "vue"

import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN } from "~/share/constants/chess"
import { mount, initRouter } from "@/component"

import ChessReserve from "~/client/components/ChessReserve"

test("ChessReserve snapshot white", t => {
  const router = initRouter()

  const getters = { "player/moveable": () => { } }
  const $store = { getters }

  const wrapper = mount(ChessReserve, {
    router,
    propsData: {
      color: "w",

      reserve: {
        [PAWN]: 1, [KNIGHT]: 2, [BISHOP]: 3, [ROOK]: 4, [QUEEN]: 5
      }
    },

    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})

test("ChessReserve snapshot black", t => {
  const router = initRouter()

  const getters = { "player/moveable": () => { } }
  const $store = { getters }

  const wrapper = mount(ChessReserve, {
    router,
    propsData: {
      color: "b",

      reserve: {
        [PAWN]: 1, [KNIGHT]: 2, [BISHOP]: 3, [ROOK]: 4, [QUEEN]: 5
      }
    },

    mocks: { $store }
  })

  t.snapshot(wrapper.html())
})

test("ChessReserve maps reserve to pieces", t => {
  const ctor = Vue.extend(ChessReserve)

  const vm = new ctor({
    propsData: {
      reserve: {
        [PAWN]: 1, [KNIGHT]: 2, [BISHOP]: 3, [ROOK]: 4, [QUEEN]: 5
      }
    }
  })

  t.deepEqual(vm.pieces, [
    { type: PAWN, coords: "RESERVE", count: 1 },
    { type: KNIGHT, coords: "RESERVE", count: 2 },
    { type: BISHOP, coords: "RESERVE", count: 3 },
    { type: ROOK, coords: "RESERVE", count: 4 },
    { type: QUEEN, coords: "RESERVE", count: 5 }
  ])
})
