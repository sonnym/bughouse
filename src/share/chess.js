import {
  find,
  flatten,
  forEach,
  groupBy,
  keys,
  map,
  pickBy,
  propEq,
  range,
  reduce,
  reverse,
  splitEvery,
  whereEq,
  zip,
  zipObj
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

const a = 97
const PIECE_REGEX = /[pnbrqkPNBRQK]/

export default class Chess {
  constructor(bfen, t) {
    this.chess = new ChessJS(this.strip(bfen))

    this.exploded = this.explode(this.chess.fen())
    this.promotions = this.extractPromotions(bfen)
  }

  get bfen() {
    return [
      this.applyPromotions(this.exploded.position),
      this.exploded.color,
      this.exploded.castling,
      this.exploded.enpassant,
      this.exploded.halfmove,
      this.exploded.move,
    ].join(" ")
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

  // TODO: validation promotion presence
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

    this.promotions[moveData.to] = this.promotions[moveData.from]
    this.promotions[moveData.from] = false

    if (result.promotion) {
      this.promotions[moveData.to] = true
    }

    this.exploded = this.explode(this.chess.fen())

    return result
  }

  drop(type, color, coords) {
    const result = this.chess.put({ type, color }, coords)

    if (this.color === BLACK) {
      this.exploded.move = int(this.exploded.move) + 1
    }

    this.exploded.enpassant = "-"
    this.exploded.halfmove = 0
    this.exploded.position = this.explode(this.chess.fen()).position

    return result
  }

  strip(bfen) {
    return bfen.replace(/~/g, "")
  }

  explode(fen) {
    return zipObj(
      ["position", "color", "castling", "enpassant", "halfmove", "move"],
      fen.split(/\s+/)
    )
  }

  extractPromotions(bfen) {
    const [position] = bfen.split(/\s+/)
    const ranks = zip(range(0, 8), position.split("/"))

    return reduce((memo, [rankOffset, rankDefintion]) => {
      let pointer = 0

      forEach(char => {

        if (char.match(/\d/)) {
          const n = int(char)


          for (let i = 0; i < n; i++) {
            const coords = `${String.fromCharCode(a + pointer + i)}${8 - rankOffset}`
            memo[coords] = false
          }

          pointer += n

        } else if (char.match(PIECE_REGEX)) {
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

  applyPromotions(position) {
    const promoted = keys(pickBy((val, key) => (val), this.promotions))

    if (promoted.length === 0) {
      return position
    }

    const numberedRanks = zip(reverse(range(1, 9)), position.split("/"))
    const promotedByRank = groupBy(coords => (coords[1]), promoted)

    const ranks =map(([rankNumber, rankDefinition]) => {
      const promoted = promotedByRank[rankNumber.toString()]

      if (!promoted) {
        return rankDefinition
      }

      let pointer = 0
      const rank = new Array(8)

      forEach(char => {
        if (char.match(/\d/)) {
          pointer += int(char)
        } else if (char.match(PIECE_REGEX)) {
          rank[pointer] = char
          pointer += 1
        }
      }, rankDefinition)

      forEach(coords => {
        const file = coords[0]
        const index = file.charCodeAt(0) - a
        const piece = rank[index]

        rank[index] = `${piece}~`
      }, promoted)

      return reduce((memo, contents) => {
        if (!contents) {
          if (memo.length === 0 || typeof memo[memo.length - 1] === "string") {
            memo.push(1)
          } else {
            memo[memo.length - 1] += 1
          }
        } else {
          memo.push(contents)
        }

        return memo
      }, [], rank).join("")
    }, numberedRanks)

    return ranks.join("/")
  }

  demotePromotedCapture(result) {
    const { from, to } = result

    if (this.promotions[to]) {
      this.promotions[to] = this.promotions[from]
      this.promotions[from] = false

      return { ...result, captured: PAWN }
    }

    return result
  }
}
