import { inspect } from "util"

import { find, pick, propEq } from "ramda"
import { Chess } from "chess.js"

import { logger } from './manager'

import { POSITION, RESULT } from "~/share/constants/game_update_types"
import {
  UNIVERSE,
  LOGIN,
  GAME,
  PLAY,
  START,
  MOVE,
  INVALID
} from "~/share/constants/actions"

const MOVE_WAIT_BASE = 4000
const MOVE_WAIT_DELTA = 2000

export default class Player {
  constructor(send) {
    this.send = send
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

  [MOVE]() {
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

  [INVALID](data) {
    logger.debug(`Invalid move: ${inspect(data)}.`)
    this.move()
  }
}

function wait(fn) {
  setTimeout(fn, MOVE_WAIT_BASE + (Math.random() * MOVE_WAIT_DELTA))
}
