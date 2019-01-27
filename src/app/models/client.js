import { v4 } from "uuid"

import Universe from "./universe"
import Revision from "./revision"

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
    logger.info(`Websocket [OPEN] (${this.uuid}) ${this.userUUID}`)
    Universe.addClient(this)

    if (this.user) {
      this.send({
        action: "user",
        user: await this.user.serialize()
      })
    }
  }

  close() {
    logger.info(`Websocket [CLOSE] (${this.uuid}) ${this.userUUID}`)
    Universe.removeClient(this)
  }

  async message(message) {
    logger.info(`Websocket [RECV] (${this.uuid}) ${message}`)

    const { action, ...rest } = JSON.parse(message)
    await this[action].call(this, rest)
  }

  send(command) {
    const message = JSON.stringify(command)

    logger.info(`Websocket [SEND] (${this.uuid}) ${message}`)

    try {
      this.socket.send(message)
    } catch({ message }) {
      logger.error(message)
    }
  }

  async play() {
    const data = await Universe.match(this)

    if (data === false) {
      this.send({ action: "wait" })
      return
    }

    data.opponent.game = this.game = data.game
    const gameData = await this.game.serialize()

    this.send({
      action: "start",
      game: gameData,
      opponent: await data.opponent.user.serialize()
    })

    data.opponent.send({
      action: "start",
      game: gameData,
      opponent: await this.user.serialize()
    })
  }

  async revision(data) {
    await Revision.create(this.game, data)
  }

  get userUUID() {
    return this.user ? this.user.get("uuid") : "unknown"
  }
}
