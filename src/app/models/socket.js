import Client from "./client"

import { apm, logger } from "~/app/index"

export default class Socket {
  constructor(universe, websocket, user) {
    this.universe = universe
    this.websocket = websocket

    this.client = new Client(universe, user, this)

    this.websocket.on("close", this.close.bind(this))
    this.websocket.on("message", this.message.bind(this))
  }

  connected() {
    logger.info({
      source: "Websocket",
      event: "OPEN",
      identifier: `users.uuid=${this.userUUID}`
    })

    this.client.sendLogin()
    this.universe.addSocket()
  }

  close() {
    logger.info({
      source: "Websocket",
      event: "CLOSE",
      identifier: `users.uuid=${this.userUUID}`
    })

    this.client.end()
    this.universe.removeSocket(this)
  }

  async message(message) {
    logger.info({
      source: "Websocket",
      event: "RECV",
      identifier: `users.uuid=${this.userUUID}`,
      data: message
    })

    const { action, ...rest } = JSON.parse(message)

    if (this.client[action]) {
      const transaction = apm.startTransaction(
        `websocket.message.${action}`,
        "websocket",
        "message",
        action
      )

      transaction.addLabels(rest)

      if (this.user) {
        transaction.setUserContext({ id: this.user.get("id") })
      }

      await this.client[action](rest)

      transaction.end()
    } else {
      logger.debug(`Encountered unknown action: ${action}`)
    }
  }

  send(command) {
    const message = JSON.stringify(command)

    logger.info({
      source: "Websocket",
      event: "SEND",
      identifier: `users.uuid=${this.userUUID}`,
      data: message
    })

    try {
      this.websocket.send(message)
    } catch (err) {
      logger.debug("[WebSocket SEND] Uncaught Exception")
    }
  }

  get userUUID() {
    return this.client.user ? this.client.user.get("uuid") : "?"
  }
}
