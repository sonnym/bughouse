import WebSocket from "ws"

import User from "./user"
import Player from "./player"

import { logger } from "./manager"

export default class Client {
  async run() {
    this.player = new Player(this.send.bind(this))

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
    logger.info(`[WebSocket RECV] ${message}`)

    this.player[action].call(this.player, rest)
  }

  send(command) {
    const message = JSON.stringify(command)
    logger.info(`[WebSocket SEND] ${message}`)

    this.socket.send(message)
  }

  close() {
    if (this.socket) {
      this.socket.close()
    }
  }
}
