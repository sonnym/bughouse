import test from "ava"

import Chess, { BLACK, WHITE, STARTING_POSITION } from "~/share/chess"

import { PENDING, DRAW, WHITE_WIN, BLACK_WIN } from "~/share/constants/results"

test("constructor: strips any tildes from the bfen", t => {
  const bfen = "Q~4rk1/8/8/8/8/8/8/R3K2R w KQ - 45 60"
  const chess = new Chess(bfen)

  t.is(chess.fen, "Q4rk1/8/8/8/8/8/8/R3K2R w KQ - 45 60")
})

test("result: is pending on incomplete game", t => {
  const chess = new Chess(STARTING_POSITION)

  t.is(chess.result, PENDING)
})

test("result: is draw when stalemate", t => {
  const bfen = "8/8/8/8/8/2qk4/8/3K4 w - - 1 2"
  const chess = new Chess(bfen)

  t.is(chess.result, DRAW)
})

test("result: is draw when insufficient material", t => {
  const bfen = "8/3n1k2/8/8/8/8/1K6/8 w - - 0 2"
  const chess = new Chess(bfen)

  t.is(chess.result, DRAW)
})

test("result: is black win when checkmate with white to move", t => {
  const bfen = "8/8/8/8/8/3k4/8/q2K4 w - - 1 3"
  const chess = new Chess(bfen)

  t.is(chess.result, BLACK_WIN)
})

test("result: is white win when checkmate and black to move", t => {
  const bfen = "3k4/3Q4/3K4/8/8/8/8/8 b - - 1 3"
  const chess = new Chess(bfen)

  t.is(chess.result, WHITE_WIN)
})

test("isValidMove: returns false when the game is already over", t => {
  const bfen = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78"
  const chess = new Chess(bfen)

  t.false(chess.isValidMove({ }))
})

test("isValidMove: returns false when color is not to move", t => {
  const chess = new Chess(STARTING_POSITION)
  const move = { from: "e2", to: "e4", color: BLACK }

  t.false(chess.isValidMove(move))
})

test("isValidMove: returns when false move is not in position", t => {
  const chess = new Chess(STARTING_POSITION)
  const move = { from: "e2", to: "e5", color: WHITE }

  t.false(chess.isValidMove(move))
})

test("isValidMove: returns true when move is in position", t => {
  const chess = new Chess(STARTING_POSITION)
  const move = { from: "e2", to: "e4", color: WHITE }

  t.true(chess.isValidMove(move))
})
