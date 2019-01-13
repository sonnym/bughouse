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
    logger.info(this.logData, `Websocket [OPEN] (${this.uuid}) ${this.userUuid}`)
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
    logger.info(this.logData, `Websocket [CLOSE] (${this.uuid}) ${this.userUuid}`)
    Universe.removeClient(this)
  }

  message(message) {
    logger.info(this.logData, `Websocket [RECV] (${this.uuid}) ${message}`)
  }

  send(command) {
    const json = JSON.stringify(command)

    logger.info({ socket: this.socket, command }, `Websocket [SEND] (${this.uuid}) ${json}`)

    this.socket.send(json)
  }

  get userUuid() {
    return this.user ? this.user.get("uuid") : "unknown"
  }

  get logData() {
    return { socket: this.socket, user: this.user }
  }
}
