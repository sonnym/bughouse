import { inspect } from "util"

import {
  all,
  compose,
  equals,
  filter,
  find,
  flatten,
  keys,
  not,
  partial,
  pick,
  propEq,
  reduce,
  values,
  zip
} from "ramda"

import { Chess } from "chess.js"

import { logger } from './manager'
import { sample } from "~/share/util"

import { PAWN } from "~/share/constants/chess"
import { POSITION, RESULT } from "~/share/constants/game_update_types"
import {
  UNIVERSE,
  LOGIN,
  GAME,
  PLAY,
  START,
  MOVE,
  DROP,
  INVALID
} from "~/share/constants/actions"

const MOVE_WAIT_BASE = 4000
const MOVE_WAIT_DELTA = 2000

export default class Player {
  constructor(send) {
    this.send = send

    this.chess = null
    this.color = null
    this.currentPosition = null
  }

  [GAME]() { }
  [UNIVERSE]() { }

  [LOGIN]({ user }) {
    this.user = user

    wait(this.send.bind(this, { action: PLAY }))
  }

  [START]({ game }) {
    this.serializedGame = game
    this.chess = new Chess()

    this.color = find(propEq("uuid", this.user.uuid), game.players).color

    if (this.color === this.chess.turn()) {
      wait(this.move.bind(this))
    }
  }

  [POSITION]({ uuid, position }) {
    if (this.serializedGame.uuid !== uuid) {
      return
    }

    this.currentPosition = position
    this.chess.load(position.fen)

    if (this.color === this.chess.turn()) {
      wait(this.move.bind(this))
    }
  }

  [RESULT]({ uuid, _result }) {
    if (uuid === this.serializedGame.uuid) {
      wait(this.play.bind(this))
    }
  }

  [INVALID](data) {
    logger.debug(`Invalid move: ${inspect(data)}.`)
    this.move()
  }

  move() {
    const reserve = this.currentPosition.reserves[this.color]

    if (all(partial(equals, [0]), values(reserve))) {
      this.sendMove()
      return
    }

    const type = sample(MOVE, DROP)

    if (type === MOVE) {
      this.sendMove()
    } else if (type === DROP) {
      this.sendDrop()
    }
  }

  sendDrop() {
    const reserve = this.currentPosition.reserves[this.color]
    const reservePieces = filter(compose(not, partial(equals, [0])), keys(reserve))

    const piece = sample(reservePieces)

    let openSquares = reduce((memo, squareName, squareValue) => {
      if (squareValue === null) {
        memo.push(squareName)
      }

      return memo
    }, zip(this.chess.SQUARES, flatten(this.chess.board())))

    if (piece === PAWN) {
      openSquares = filter(square => {
        return square.match(/[a-h](1|8)/)
      }, openSquares)
    }

    const square = sample(openSquares)

    this.send({ action: DROP, piece, square })
  }

  sendMove() {
    const moves = this.chess.moves({ verbose: true })
    const move = moves[Math.floor(Math.random() * moves.length)]

    if (move.piece === this.chess.PAWN && move.to.match(/1|8/)) {
      move.promotion = [
        this.chess.KNIGHT,
        this.chess.BISHOP,
        this.chess.ROOK,
        this.chess.QUEEN
      ][Math.floor(Math.random() * 4)]
    }

    this.send({
      action: MOVE,
      ...pick(["from", "to", "promotion"], move)
    })
  }
}

function wait(fn) {
  setTimeout(fn, MOVE_WAIT_BASE + (Math.random() * MOVE_WAIT_DELTA))
}
