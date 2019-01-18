import { v4 } from "uuid"

import Universe from "./universe"

import { logger } from "./../index"

export default class Client {
  constructor(socket, user) {
    this.socket = socket
    this.user = user

    this.uuid = v4()

    this.socket.addEventListener("close", this.close.bind(this))
    this.socket.addEventListener("message", this.message.bind(this))
  }

  async connected() {
    logger.info(`Websocket [OPEN] (${this.uuid}) ${this.userUuid}`)
    Universe.addClient(this)

    if (this.user) {
      this.send({
        action: "user",
        data: {
          user: await this.user.serialize()
        }
      })
    }
  }

  close() {
    logger.info(`Websocket [CLOSE] (${this.uuid}) ${this.userUuid}`)
    Universe.removeClient(this)
  }

  message({ data: message }) {
    logger.info(`Websocket [RECV] (${this.uuid}) ${message}`)

    const { action, ...rest } = JSON.parse(message)
    this[action].call(this, rest)
  }

  send(command) {
    const message = JSON.stringify(command)

    logger.info(`Websocket [SEND] (${this.uuid}) ${message}`)

    try {
      this.socket.send(message)
    } catch(e) { } // eslint-disable-line no-empty
  }

  get userUuid() {
    return this.user ? this.user.get("uuid") : "unknown"
  }
}
