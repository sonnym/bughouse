import { promisify } from "util"

import redis from "redis"
import { sort } from "ramda"

import { isTest } from "./../../share/environment"

import Game from "./game"

const REDIS_DB = isTest() ? 7 : 1

const UNIVERSE = "universe"
const USERS = "universe:users"

export default class Universe {
  static async init() {
    this.lobby = null

    await promisify(this.redisClient.set).bind(this.redisClient)(USERS, 0)

    return this
  }

  static get redisClient() {
    if (!this._redisClient) {
      this._redisClient = redis.createClient({ db: REDIS_DB })
    }

    return this._redisClient
  }

  static async match(client) {
    if (this.lobby === null) {
      this.lobby = client
      return false

    } else if (this.lobby.uuid === client.uuid) {
      return false

    } else {
      const opponent = this.lobby
      this.lobby = null

      const users = sort(() => Math.random, [opponent.user, client.user])
      const game = await Game.create(users[0], users[1])

      return { opponent, game }
    }
  }

  static addClient(client) {
    const users = this.redisClient.incr(USERS)

    if (this.lobby === null) {
      this.lobby = client
    }

    this.redisClient.publish(UNIVERSE, users)
  }

  static removeClient({ uuid }) {
    this.redisClient.decr(USERS)

    if (this.lobby && this.lobby.uuid === uuid) {
      this.lobby = null
    }
  }

  static async users() {
    return await promisify(this.redisClient.get).bind(this.redisClient)(USERS)
  }

  static async serialize() {
    return {
      activeUsers: parseInt(await this.users(), 10)
    }
  }
}
