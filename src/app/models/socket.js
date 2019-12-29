import { v4 } from "uuid"

import Redis from "./redis"
import Player from "./player"

import { logger } from "~/app/index"

export default class Socket {
  constructor(universe, websocket, user) {
    this.universe = universe
    this.websocket = websocket
    this.user = user

    this.uuid = v4()

    this.player = new Player(universe, this)
    this.redis = new Redis(this.player)

    this.websocket.on("close", this.close.bind(this))
    this.websocket.on("message", this.message.bind(this))
  }

  async connected() {
    logger.info(`[Websocket OPEN] (${this.uuid}) ${this.userUUID}`)

    this.universe.addSocket(this)
    this.player.subscribeGames()

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

    if (this.player[action]) {
      this.player[action](rest)
    }
  }

  send(command) {
    const message = JSON.stringify(command)

    logger.info(`[Websocket SEND] (${this.uuid}) ${message}`)

    try {
      this.websocket.send(message)
    } catch(err) {
      if (this.websocket.readstate > 1) {
        return
      }

      throw err
    }
  }

  get userUUID() {
    return this.user ? this.user.get("uuid") : "unknown"
  }
}
