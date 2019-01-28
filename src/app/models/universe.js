import { sort } from "ramda"

import Redis from "./redis"

import Game from "./game"

const UNIVERSE_CHANNEL = "universe"
const USERS_KEY = "universe:users"

export { UNIVERSE_CHANNEL }

export default class Universe {
  static async init() {
    this.lobby = null
    this.redis = new Redis()

    await this.redis.setAsync(USERS_KEY, 0)

    return this
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

  static async addClient(client) {
    await client.redis.subscribe(UNIVERSE_CHANNEL)

    this.redis.multi()
      .incr(USERS_KEY)
      .publish(UNIVERSE_CHANNEL, "")
      .exec()
  }

  static removeClient(client) {
    client.redis.end(true)

    this.redis.multi()
      .decr(USERS_KEY)
      .publish(UNIVERSE_CHANNEL, "")
      .exec()

    if (this.lobby && this.lobby.uuid === client.uuid) {
      this.lobby = null
    }
  }

  static async users() {
    return await this.redis.getAsync(USERS_KEY)
  }

  static async serialize() {
    return {
      activeUsers: parseInt(await this.users(), 10)
    }
  }
}
