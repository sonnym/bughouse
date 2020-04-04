import test from "ava"

import { stub } from "sinon"
import { v4 } from "uuid"

import Universe from "~/app/models/universe"

import Capture from "~/app/models/capture"

const games = (() => {
  const _arr = [v4(), v4(), v4()]

  return {
    head: () => _arr[0],
    tail: () => _arr[2],
    next: (n) => {
      const i = _arr.indexOf(n) + 1
      return i < _arr.length ? _arr[i] : null
    },
    prev: (n) => {
      const i = _arr.indexOf(n) - 1
      return i > -1 ? _arr[i] : null
    }
  }
})()

const universe = new Universe()
universe.games = games

test("process: white piece in even index goes to next", async t => {
  const position_ = v4()
  const reserve = stub().returns({
    related: stub().returns(position_)
  })
  const Revision = { reserve }

  const piece = "P"
  const game = { get: () => { return games.tail() } }
  const next = games.head()

  const { uuid, position } = await new Capture(universe, Revision).process(game, piece)

  t.is(next, uuid)
  t.is(position_, position)

  t.true(reserve.calledOnceWith(game, next, piece))
})

test("process: white piece in odd index goes to prev", async t => {
  const position_ = v4()
  const reserve = stub().returns({
    related: stub().returns(position_)
  })
  const Revision = { reserve }

  const piece = "P"
  const game = { get: () => { return games.next(games.head()) } }
  const prev = games.head()

  const { uuid, position } = await new Capture(universe, Revision).process(game, piece)

  t.is(prev, uuid)
  t.is(position_, position)

  t.true(reserve.calledOnceWith(game, prev, piece))
})

test("process: black piece in even index goes to prev", async t => {
  const position_ = v4()
  const reserve = stub().returns({
    related: stub().returns(position_)
  })
  const Revision = { reserve }

  const piece = "p"
  const game = { get: () => { return games.head() } }
  const prev = games.tail()

  const { uuid, position } = await new Capture(universe, Revision).process(game, piece)

  t.is(prev, uuid)
  t.is(position_, position)

  t.true(reserve.calledOnceWith(game, prev, piece))
})

test("process: black piece in odd index goes to next", async t => {
  const position_ = v4()
  const reserve = stub().returns({
    related: stub().returns(position_)
  })
  const Revision = { reserve }

  const piece = "p"
  const game = { get: () => { return games.next(games.head()) } }
  const next = games.tail()

  const { uuid, position } = await new Capture(universe, Revision).process(game, piece)

  t.is(next, uuid)
  t.is(position_, position)

  t.true(reserve.calledOnceWith(game, next, piece))
})
