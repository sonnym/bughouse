import Client from "./client"

import { logger } from "~/app/index"

export default class Socket {
  constructor(universe, websocket, user) {
    this.universe = universe
    this.websocket = websocket

    this.client = new Client(universe, user, this)

    this.websocket.on("close", this.close.bind(this))
    this.websocket.on("message", this.message.bind(this))
  }

  async connected() {
    logger.info(`[Websocket OPEN] (${this.userUUID}) ${this.userUUID}`)

    this.client.sendLogin()
    this.universe.addSocket()
  }

  close() {
    logger.info(`[Websocket CLOSE] (${this.userUUID}) ${this.userUUID}`)

    this.client.end()
    this.universe.removeSocket(this)
  }

  async message(message) {
    logger.info(`[Websocket RECV] (${this.userUUID}) ${message}`)

    const { action, ...rest } = JSON.parse(message)

    if (this.client[action]) {
      this.client[action](rest)
    } else {
      logger.debug(`Encountered unknown action: ${action}`)
    }
  }

  send(command) {
    const message = JSON.stringify(command)

    logger.info(`[Websocket SEND] (${this.userUUID}) ${message}`)

    try {
      this.websocket.send(message)
    } catch (err) {
      logger.debug("[WebSocket SEND] Uncaught Exception")
    }
  }

  get userUUID() {
    return this.client.user ? this.client.user.get("uuid") : "unknown"
  }
}
