import { v4 } from "uuid"

import Universe from "./universe"

import { logger } from "./../index"

export default class Client {
  constructor(socket, user) {
    this.socket = socket
    this.user = user

    this.uuid = v4()

    this.socket.on("close", this.close.bind(this))
    this.socket.on("message", this.message.bind(this))
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

  message(message) {
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

  async play() {
    const data = await Universe.match(this)

    if (data === false) {
      this.send({ action: "wait" })
      return
    }

    const gameData = await data.game.serialize()

    this.send({
      action: "start",
      data: {
        game: gameData,
        opponent: await data.opponent.user.serialize()
      }
    })

    data.opponent.send({
      action: "start",
      data: {
        game: gameData,
        opponent: await this.user.serialize()
      }
    })
  }

  get userUuid() {
    return this.user ? this.user.get("uuid") : "unknown"
  }
}
