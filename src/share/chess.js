import { find, pick, whereEq } from "ramda"

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

  isValidMove(moveData) {
    if (this.chess.game_over()) {
      return false
    }

    if (moveData.color !== this.chess.turn()) {
      return false
    }

    const foundMove = find(
      whereEq(pick(["from", "to"], moveData)),
      this.chess.moves({ verbose: true })
    )

    if (!foundMove) {
      return false
    }

    return true
  }

  // TODO: exit early if square is occupied
  isValidDrop(piece, color, square) {
    if (piece === PAWN && square.match(/[a-h](1|8)/)) {
      return false
    }

    if (this.chess.turn() !== color) {
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
  drop(type, color, square) {
    return this.chess.put({ type, color }, square)
  }

  strip(bfen) {
    return bfen.replace(/~/, "")
  }
}
