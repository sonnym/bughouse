import { pick } from "ramda"

import { Chess } from "chess.js"

import { REVISION_TYPES } from "~/share/constants"

export default class Player {
  constructor(send) {
    this.send = send
  }

  games() { }
  universe() { }

  user({ user }) {
    this.user = user
    this.send({ action: "play" })
  }

  start({ game }) {
    this.game = game
    this.chess = new Chess()

    if (game.whiteUser.uuid === this.user.uuid) {
      this.color = this.chess.WHITE
    } else if (game.blackUser.uuid === this.user.uuid) {
      this.color = this.chess.BLACK
    }

    if (this.color === this.chess.turn()) {
      this.move()
    }
  }

  position({ game, position }) {
    if (this.game.uuid !== game.uuid) {
      return
    }

    this.chess.load(position.fen)

    if (this.color === this.chess.turn()) {
      this.move()
    }
  }

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
      action: "revision",
      type: REVISION_TYPES.MOVE,
      ...pick(["from", "to", "promotion"], move)
    })
  }
}
