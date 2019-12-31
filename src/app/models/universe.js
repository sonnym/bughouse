import { isNil } from "ramda"

import List from "./list"
import Redis from "./redis"

import Lobby from "./lobby"
import Game from "./game"

const UNIVERSE_CHANNEL = "universe"
const USERS_KEY = "universe:users"

export { UNIVERSE_CHANNEL }

export default class Universe {
  constructor() {
    this.redis = new Redis()

    // TODO: restore state from redis
    this.redis.flushdb()
    this.redis.set(USERS_KEY, 0)

    this.lobby = new Lobby(Game)
    this.games = new List("games")
  }

  async registerClient(client) {
    const { game, whiteClient, blackClient } = await this.lobby.push(client)

    if (isNil(game)) {
      return
    }

    await this.games.push(game.get("uuid"))

    const serializedGame = await game.serialize()

    whiteClient.startGame(serializedGame)
    blackClient.startGame(serializedGame)

    // TODO: publish universe
    // TODO: update subscription for subscribed to tail
  }

  async addSocket() {
    this.redis.multi()
      .incr(USERS_KEY)
      .publish(
        UNIVERSE_CHANNEL,
        JSON.stringify(await this.serialize())
      ).exec()
  }

  // TODO: create a forfeit revision
  async removeSocket(socket) {
    this.redis.multi()
      .decr(USERS_KEY)
      .publish(
        UNIVERSE_CHANNEL,
        JSON.stringify(await this.serialize())
      ).exec()

    // TODO: implmenet in lobby object
    if (this.lobby && this.lobby.uuid === socket.uuid) {
      this.lobby = null
    }
  }

  async users() {
    return await this.redis.getAsync(USERS_KEY)
  }

  async serialize() {
    return {
      users: parseInt(await this.users(), 10),
      games: parseInt(await this.games.length(), 10)
    }
  }

  publishPosition(uuid, position) {
    this.redis.publish(uuid, position.get("m_fen"))
  }
}
