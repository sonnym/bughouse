import {
  find,
  flatten,
  forEach,
  map,
  propEq,
  range,
  reduce,
  splitEvery,
  whereEq,
  zip
} from "ramda"

import { Chess as ChessJS } from "chess.js"

import { int } from "./util"

import { PENDING, DRAW, WHITE_WIN, BLACK_WIN } from "~/share/constants/results"

const chess = new ChessJS()

export const WHITE = chess.WHITE
export const BLACK = chess.BLACK

export const PAWN = chess.PAWN
export const ROOK = chess.ROOK
export const KNIGHT = chess.KNIGHT
export const BISHOP = chess.BISHOP
export const QUEEN = chess.QUEEN
export const KING = chess.KING

export const SQUARES = chess.SQUARES

export const STARTING_POSITION = chess.fen()

export default class Chess {
  constructor(bfen, t) {
    this._bfen = bfen

    this.extractPromotions(bfen)

    this.fen = this.strip(bfen)
    this.chess = new ChessJS(this.fen)
  }

  get bfen() {
    // TODO: empty en-passant for dropping color
    // TODO: on drop, update half / move number
    // TODO: restore tildes (follow-on-move)
    return this._bfen
  }

  get color() {
    return this.chess.turn()
  }

  get moves() {
    return this.chess.moves({ verbose: true })
  }

  get result() {
    // because only fen is exposed, deliberately skip draw and threefold repetition
    if (this.chess.in_stalemate() || this.chess.insufficient_material()) {
      return DRAW
    }

    if (this.chess.in_checkmate()) {
      switch (this.chess.turn()) {
        case WHITE: return BLACK_WIN
        case BLACK: return WHITE_WIN
      }
    }

    return PENDING
  }

  get squares() {
    return map(
      ([rankSquares, rankCoords]) => {
        return map(
          ([square, coords]) => ({ ...square, coords }),
          zip(rankSquares, rankCoords)
        )
    }, zip(this.chess.board(), splitEvery(8, SQUARES)))
  }

  getMoves(coords) {
    return this.chess.moves({ square: coords, verbose: true })
  }

  isValidMove({ color, from, to }) {
    if (this.chess.game_over()) {
      return false
    }

    if (color !== this.chess.turn()) {
      return false
    }

    const foundMove = find(
      whereEq({ from, to }),
      this.chess.moves({ verbose: true })
    )

    if (!foundMove) {
      return false
    }

    return true
  }

  isValidDrop({ color, piece, coords }) {
    if (color !== this.chess.turn()) {
      return false
    }

    const square = find(propEq("coords", coords), flatten(this.squares))

    if (square.color && square.type) {
      return false
    }

    if (piece === PAWN && coords.match(/[a-h](1|8)/)) {
      return false
    }

    return true
  }

  isGameOver() {
    return this.chess.game_over()
  }

  move(moveData) {
    let result

    result = this.chess.move(moveData)

    if (result.captured && result.captured !== PAWN) {
      result = this.demotePromotedCapture(result)
    }

    this.fen = this.chess.fen()

    return result
  }

  // TODO: update half/move number
  drop(type, color, coords) {
    return this.chess.put({ type, color }, coords)
  }

  strip(bfen) {
    return bfen.replace(/~/, "")
  }

  extractPromotions(bfen) {
    const a = 97

    const [position] = bfen.split(/\s+/)
    const ranks = zip(range(0, 8), position.split("/"))

    this.promotions = reduce((memo, [rankOffset, rankDefintion]) => {
      let pointer = 0

      forEach(char => {
        if (char.match(/\d/)) {
          const n = int(char)

          for (let i = 0; i < n; i++) {
            const coords = `${String.fromCharCode(a + pointer + i)}${8 - rankOffset}`
            memo[coords] = false
          }

          pointer += n

        } else if (char.match(/[pkbrqkPKBRQK]/)) {
          const coords = `${String.fromCharCode(a + pointer)}${8 - rankOffset}`
          memo[coords] = false

          pointer += 1

        } else if (char === "~") {
          const coords = `${String.fromCharCode(a + pointer - 1)}${8 - rankOffset}`
          memo[coords] = true
        }
      }, rankDefintion)

      return memo
    }, { }, ranks)
  }

  demotePromotedCapture(result) {
    const { to } = result

    if (this.promotions[to]) {
      this.promotions[to] = false

      return { ...result, captured: PAWN }
    }

    return result
  }
}
