import { v4 } from "uuid"

import Redis from "./redis"

import Player from "./player"
import Game from "./game"

import { logger } from "~/app/index"

export default class Socket {
  constructor(universe, websocket, user) {
    this.universe = universe
    this.websocket = websocket
    this.user = user

    this.uuid = v4()

    this.player = new Player(universe, this)
    this.redis = new Redis(this)

    this.websocket.on("close", this.close.bind(this))
    this.websocket.on("message", this.message.bind(this))
  }

  async connected() {
    logger.info(`[Websocket OPEN] (${this.uuid}) ${this.userUUID}`)

    this.universe.addSocket(this)

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
    this.send({ action: "universe", ...await this.universe.serialize() })
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
