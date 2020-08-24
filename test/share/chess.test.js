import test from "ava"

import Chess, {
  BLACK,
  WHITE,
  STARTING_POSITION,
  KING,
  QUEEN,
  ROOK,
  BISHOP,
  KNIGHT,
  PAWN
} from "~/share/chess"

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

test("squares: when representing starting position", t => {
  const chess = new Chess(STARTING_POSITION)

  t.deepEqual(chess.squares, [
    [
      { color: BLACK, type: ROOK, coords: "a8" },
      { color: BLACK, type: KNIGHT, coords: "b8" },
      { color: BLACK, type: BISHOP, coords: "c8" },
      { color: BLACK, type: QUEEN, coords: "d8" },
      { color: BLACK, type: KING, coords: "e8" },
      { color: BLACK, type: BISHOP, coords: "f8" },
      { color: BLACK, type: KNIGHT, coords: "g8" },
      { color: BLACK, type: ROOK, coords: "h8" }
    ] , [
      { color: BLACK, type: PAWN, coords: "a7" },
      { color: BLACK, type: PAWN, coords: "b7" },
      { color: BLACK, type: PAWN, coords: "c7" },
      { color: BLACK, type: PAWN, coords: "d7" },
      { color: BLACK, type: PAWN, coords: "e7" },
      { color: BLACK, type: PAWN, coords: "f7" },
      { color: BLACK, type: PAWN, coords: "g7" },
      { color: BLACK, type: PAWN, coords: "h7" }
    ], [
      { coords: "a6" },
      { coords: "b6" },
      { coords: "c6" },
      { coords: "d6" },
      { coords: "e6" },
      { coords: "f6" },
      { coords: "g6" },
      { coords: "h6" }
    ], [
      { coords: "a5" },
      { coords: "b5" },
      { coords: "c5" },
      { coords: "d5" },
      { coords: "e5" },
      { coords: "f5" },
      { coords: "g5" },
      { coords: "h5" }
    ], [
      { coords: "a4" },
      { coords: "b4" },
      { coords: "c4" },
      { coords: "d4" },
      { coords: "e4" },
      { coords: "f4" },
      { coords: "g4" },
      { coords: "h4" }
    ], [
      { coords: "a3" },
      { coords: "b3" },
      { coords: "c3" },
      { coords: "d3" },
      { coords: "e3" },
      { coords: "f3" },
      { coords: "g3" },
      { coords: "h3" }
    ], [
      { color: WHITE, type: PAWN, coords: "a2" },
      { color: WHITE, type: PAWN, coords: "b2" },
      { color: WHITE, type: PAWN, coords: "c2" },
      { color: WHITE, type: PAWN, coords: "d2" },
      { color: WHITE, type: PAWN, coords: "e2" },
      { color: WHITE, type: PAWN, coords: "f2" },
      { color: WHITE, type: PAWN, coords: "g2" },
      { color: WHITE, type: PAWN, coords: "h2" }
    ], [
      { color: WHITE, type: ROOK, coords: "a1" },
      { color: WHITE, type: KNIGHT, coords: "b1" },
      { color: WHITE, type: BISHOP, coords: "c1" },
      { color: WHITE, type: QUEEN, coords: "d1" },
      { color: WHITE, type: KING, coords: "e1" },
      { color: WHITE, type: BISHOP, coords: "f1" },
      { color: WHITE, type: KNIGHT, coords: "g1" },
      { color: WHITE, type: ROOK, coords: "h1" }
    ]
  ])
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

test("isValidDrop: returns false unless color has current turn", t => {
  const chess = new Chess(STARTING_POSITION)
  const drop = { color: BLACK }

  t.false(chess.isValidDrop(drop))
})

test("isValidDrop: returns false if square is occupied", t => {
  const chess = new Chess(STARTING_POSITION)
  const drop = { color: WHITE, piece: PAWN, coords: "a7" }

  t.false(chess.isValidDrop(drop))
})

test("isValidDrop: returns false if a pawn tries to fall on back ranks", t => {
  const chess = new Chess("8/8/8/3k4/8/3K4/3Q4/8 w - - 0 1")
  let drop

  drop = { color: WHITE, piece: PAWN, coords: "d8" }
  t.false(chess.isValidDrop(drop))

  drop = { color: WHITE, piece: PAWN, coords: "d1" }
  t.false(chess.isValidDrop(drop))
})

test("isValidDrop: returns true when drop is valid", t => {
  const chess = new Chess("8/8/8/3k4/8/3K4/3Q4/8 w - - 0 1")
  const drop = { color: WHITE, piece: PAWN, coords: "d4" }

  t.true(chess.isValidDrop(drop))
})
