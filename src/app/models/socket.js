import Client from "./client"

import { logger } from "~/app/index"

export default class Socket {
  constructor(universe, websocket, user) {
    this.universe = universe
    this.websocket = websocket

    this.user = user
    this.client = new Client(universe, this)

    this.websocket.on("close", this.close.bind(this))
    this.websocket.on("message", this.message.bind(this))
  }

  async connected() {
    logger.info(`[Websocket OPEN] (${this.uuid}) ${this.userUUID}`)

    this.universe.addSocket()

    if (this.user) {
      this.send({
        action: "user",
        user: await this.user.serialize()
      })
    }
  }

  close() {
    logger.info(`[Websocket CLOSE] (${this.uuid}) ${this.userUUID}`)
    this.universe.removeSocket(this)
  }

  async message(message) {
    logger.info(`[Websocket RECV] (${this.uuid}) ${message}`)

    const { action, ...rest } = JSON.parse(message)

    if (this.client[action]) {
      this.client[action](rest)
    } else {
      logger.debug(`Encountered unknown action: ${action}`)
    }
  }

  send(command) {
    const message = JSON.stringify(command)

    logger.info(`[Websocket SEND] (${this.uuid}) ${message}`)

    try {
      this.websocket.send(message)
    } catch (err) {
      logger.debug("[WebSocket SEND] Uncaught Exception")
    }
  }

  get uuid() {
    return this.client.uuid
  }

  get userUUID() {
    return this.user ? this.user.get("uuid") : "unknown"
  }
}
