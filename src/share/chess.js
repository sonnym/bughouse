import { find, flatten, map, propEq, splitEvery, whereEq, zip } from "ramda"

import { Chess as ChessJS } from "chess.js"

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

  // TODO: captured promoted becomes pawn
  move(moveData) {
    const result = this.chess.move(moveData)

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
}
