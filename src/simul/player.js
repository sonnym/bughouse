import { inspect } from "util"

import { find, pick, propEq } from "ramda"
import { Chess } from "chess.js"

import { logger } from './manager'

import { POSITION, RESULT } from "~/share/constants/game_update_types"

export default class Player {
  constructor(send) {
    this.send = send
  }

  game() { }
  universe() { }

  login({ user }) {
    this.user = user
    this.send({ action: "play" })
  }

  start({ game }) {
    this.game = game
    this.chess = new Chess()

    this.color = find(propEq("uuid", this.user.uuid), game.players).color

    if (this.color === this.chess.turn()) {
      this.move()
    }
  }

  [POSITION]({ uuid, position }) {
    if (this.game.uuid !== uuid) {
      return
    }

    this.chess.load(position.fen)

    if (this.color === this.chess.turn()) {
      this.move()
    }
  }

  [RESULT]({ uuid, result }) { }

  move() {
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
      action: "move",
      ...pick(["from", "to", "promotion"], move)
    })
  }

  invalid(data) {
    logger.debug(`Invalid move: ${inspect(data)}.`)
    this.move()
  }
}
