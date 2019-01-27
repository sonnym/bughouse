import { v4 } from "uuid"

import redis from "redis"

import Universe from "./universe"
import Game from "./game"
import Revision from "./revision"

import { logger } from "./../index"
import { isTest } from "./../../share/environment"

const REDIS_DB = isTest() ? 7 : 1

export default class Client {
  constructor(socket, user) {
    this.socket = socket
    this.user = user

    this.uuid = v4()

    this.socket.on("close", this.close.bind(this))
    this.socket.on("message", this.message.bind(this))
  }

  get redisClient() {
    if (!this._redisClient) {
      this._redisClient = redis.createClient({ db: REDIS_DB })
    }

    return this._redisClient
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
    const result = await Universe.match(this)

    if (result === false) {
      this.send({ action: "wait" })
      return
    }

    const { game, opponent } = result
    const gameData = await game.serialize()

    this.startGame(gameData)
    opponent.startGame(gameData)
  }

  startGame(data) {
    this.gameUUID = data.uuid

    this.redisClient.subscribe(data.uuid)
    this.send({ action: "start", game: data })
  }

  async revision(data) {
    const game = await Game.where({ uuid: this.gameUUID }).fetch()
    await Revision.create(game, data)

    game.publishPosition()
  }

  get userUUID() {
    return this.user ? this.user.get("uuid") : "unknown"
  }
}
