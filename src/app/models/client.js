import redis from "redis"

import { v4 } from "uuid"

import Universe from "./universe"
import Player from "./player"

import { logger } from "./../index"
import { isTest } from "./../../share/environment"

const REDIS_DB = isTest() ? 7 : 1

export default class Client {
  constructor(socket, user) {
    this.socket = socket
    this.user = user

    this.uuid = v4()

    this.player = new Player(this)

    this.socket.on("close", this.close.bind(this))
    this.socket.on("message", this.message.bind(this))
  }

  get redisClient() {
    if (!this._redisClient) {
      this._redisClient = redis.createClient({ db: REDIS_DB })
      this._redisClient.on("message", this.message.bind(this))
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
    await this.player[action](rest)
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

  get userUUID() {
    return this.user ? this.user.get("uuid") : "unknown"
  }
}
