import { pick } from "ramda"

import WebSocket from "ws"
import { Chess } from "chess.js"

import makeLogger from "~/share/logger"
import { REVISION_TYPES } from "~/share/constants"

import User from "./user"

const logger = makeLogger("simul")

export default class Client {
  async run() {
    const { cookie } = await User.create()

    this.connect(cookie)
  }

  connect(cookie) {
    this.socket = new WebSocket("ws://localhost:3000/ws", {
      headers: { Cookie: cookie }
    })

    this.socket.on("open", this.open.bind(this))
    this.socket.on("message", this.message.bind(this))
  }

  open() {
    logger.info("[WebSocket OPEN]")
  }

  message(message) {
    const { action, ...rest } = JSON.parse(message)

    try {
      logger.info(`[WebSocket RECV] ${message}`)
      this[action].call(this, rest)
    } catch(e) {
      logger.error(e)
    }
  }

  close() {
    if (this.socket) {
      this.socket.close()
    }
  }

  send(command) {
    const message = JSON.stringify(command)

    this.socket.send(message)
    logger.info(`[WebSocket SEND] ${message}`)
  }

  universe() { }
  wait() { }
  games() { }

  user({ user }) {
    this.user = user
    this.send({ action: "play" })
  }

  start({ game, opponent }) {
    this.game = game
    this.chess = new Chess()

    if (game.whiteUser.uuid === this.user.uuid) {
      this.color = this.chess.WHITE
    } else if (game.blackUser.uuid === this.user.uuid) {
      this.color = this.chess.BLACK
    }

    if (this.color === this.chess.turn()) {
      setTimeout(this.move.bind(this), 15000)
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

    process.nextTick(this.send.bind(this, {
      action: "revision",
      type: REVISION_TYPES.MOVE,
      ...pick(["from", "to", "promotion"], move)
    }))
  }
}
