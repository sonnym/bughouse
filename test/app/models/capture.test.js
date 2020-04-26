import test from "ava"

import { find, map } from "ramda"

import Factory from "@/factory"

import { WHITE, BLACK, PAWN } from "~/share/constants/chess"

import Position from "~/app/models/position"

import Capture from "~/app/models/capture"

const generator = async () => {
  const games = [
    await Factory.game(),
    await Factory.game(),
    await Factory.game()
  ]

  const _arr = map(game => game.get("uuid"), games)

  return {
    games,
    gamesList: {
      head: () => _arr[0],
      tail: () => _arr[2],
      next: (n) => {
        const i = _arr.indexOf(n) + 1
        return i < _arr.length ? _arr[i] : null
      },
      prev: (n) => {
        const i = _arr.indexOf(n) - 1
        return i > -1 ? _arr[i] : null
      },
      after: function(n) {
        return this.next(n) || this.head()
      },
      before: function(n) {
        return this.prev(n) || this.tail()
      }
    }
  }
}

test("process: white piece in even index goes to next", async t => {
  const { games, gamesList } = await generator()

  const piece = PAWN
  const gameUUID = gamesList.tail()
  const game = find(game => game.get("uuid") === gameUUID, games)
  const next = gamesList.head()

  const capture = new Capture({ games: gamesList })
  const { uuid, position } = await capture.process(game, WHITE, piece)

  t.is(next, uuid)
  t.true(position instanceof Position)
})

test("process: white piece in odd index goes to prev", async t => {
  const { games, gamesList } = await generator()

  const piece = PAWN
  const gameUUID = gamesList.next(gamesList.head())
  const game = find(game => game.get("uuid") === gameUUID, games)
  const prev = gamesList.head()

  const capture = new Capture({ games: gamesList })
  const { uuid, position } = await capture.process(game, WHITE, piece)

  t.is(prev, uuid)
  t.true(position instanceof Position)
})

test("process: black piece in even index goes to prev", async t => {
  const { games, gamesList } = await generator()

  const piece = PAWN
  const gameUUID = gamesList.head()
  const game = find(game => game.get("uuid") === gameUUID, games)
  const prev = gamesList.tail()

  const capture = new Capture({ games: gamesList })
  const { uuid, position } = await capture.process(game, BLACK, piece)

  t.is(prev, uuid)
  t.true(position instanceof Position)
})

test("process: black piece in odd index goes to next", async t => {
  const { games, gamesList } = await generator()

  const piece = PAWN
  const gameUUID = gamesList.next(gamesList.head())
  const game = find(game => game.get("uuid") === gameUUID, games)
  const next = gamesList.tail()

  const capture = new Capture({ games: gamesList })
  const { uuid, position } = await capture.process(game, BLACK, piece)

  t.is(next, uuid)
  t.true(position instanceof Position)
})
