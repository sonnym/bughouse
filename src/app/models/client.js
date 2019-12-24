import { v4 } from "uuid"

import Redis from "./redis"

import Universe from "./universe"
import Player from "./player"
import Game from "./game"

import { logger } from "~/app/index"

export default class Client {
  constructor(socket, user) {
    this.socket = socket
    this.user = user

    this.uuid = v4()

    this.player = new Player(this)
    this.redis = new Redis(this)

    this.socket.on("close", this.close.bind(this))
    this.socket.on("message", this.message.bind(this))
  }

  async connected() {
    logger.info(`[Websocket OPEN] (${this.uuid}) ${this.userUUID}`)

    Universe.addClient(this)

    if (this.user) {
      this.send({
        action: "user",
        user: await this.user.serialize()
      })
    }
  }

  close() {
    logger.info(`[Websocket CLOSE] (${this.uuid}) ${this.userUUID}`)
    Universe.removeClient(this)
  }

  async message(message) {
    logger.info(`[Websocket RECV] (${this.uuid}) ${message}`)

    try {
      const { action, ...rest } = JSON.parse(message)
      await this.player[action](rest)
    } catch(err) {
      logger.error(err)
    }
  }

  sendPosition(game, position) {
    this.send({ action: "position", game, position })
  }

  async sendGames(gameUUIDs) {
    let before, primary, after

    const games = await Game.where("uuid", "in", gameUUIDs).fetchAll()

    if (games.length === 1) {
      primary = games.at(0)
    } else {
      [before, primary, after] = [games.at(0), games.at(1), games.at(2)]
    }

    const gamesData = {
      before: before ? await before.serialize() : null,
      primary: primary ? await primary.serialize() : null,
      after: after ? await after.serialize() : null,
    }

    this.send({ action: "games", ...gamesData })
  }

  async sendUniverse() {
    this.send({ action: "universe", ...await Universe.serialize() })
  }

  send(command) {
    const message = JSON.stringify(command)

    logger.info(`[Websocket SEND] (${this.uuid}) ${message}`)

    try {
      this.socket.send(message)
    } catch(err) {
      if (this.socket.readstate > 1) {
        return
      }

      logger.error(err)
    }
  }

  get userUUID() {
    return this.user ? this.user.get("uuid") : "unknown"
  }
}
