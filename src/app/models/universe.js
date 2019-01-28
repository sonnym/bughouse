import { sort } from "ramda"

import Redis from "./redis"

import Game from "./game"

const UNIVERSE = "universe"
const USERS = "universe:users"

export default class Universe {
  static async init() {
    this.lobby = null
    this.redis = new Redis()

    await this.redis.setAsync(USERS, 0)

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

  static addClient(client) {
    const users = this.redis.incr(USERS)

    this.redis.publish(UNIVERSE, users)
  }

  static removeClient({ uuid }) {
    this.redis.decr(USERS)

    if (this.lobby && this.lobby.uuid === uuid) {
      this.lobby = null
    }
  }

  static async users() {
    return await this.redis.getAsync(USERS)
  }

  static async serialize() {
    return {
      activeUsers: parseInt(await this.users(), 10)
    }
  }
}
