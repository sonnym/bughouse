import List from "./list"
import Redis from "./redis"

import Lobby from "./lobby"

import Game from "./game"

const UNIVERSE_CHANNEL = "universe"
const USERS_KEY = "universe:users"

export { UNIVERSE_CHANNEL }

export default class Universe {
  static async init() {
    this.redis = new Redis()

    this.redis.flushdb()
    this.redis.set(USERS_KEY, 0)

    this.lobby = new Lobby(Game)
    this.games = new List("games")

    Game.on("create", this.registerGame.bind(this))
    Game.on("revision", this.publishPosition.bind(this))

    return this
  }

  static registerGame(game) {
    this.games.push(game.get("uuid"))
    this.redis.publish(UNIVERSE_CHANNEL, "")
  }

  static play(player) {
    this.lobby.push(player)
  }

  static async addClient(client) {
    await client.redis.subscribeAsync(UNIVERSE_CHANNEL)

    if (await this.games.length() > 0) {
      const tail = await this.games.tail()
      const head = await this.games.head()
      const next = await this.games.next(head)

      await client.sendGames([tail, head, next])

      if (tail) {
        await client.redis.subscribeAsync(tail)
      }

      if (head) {
        await client.redis.subscribeAsync(head)
      }

      if (next) {
        await client.redis.subscribeAsync(next)
      }
    }

    this.redis.multi()
      .incr(USERS_KEY)
      .publish(UNIVERSE_CHANNEL, "")
      .exec()
  }

  static async publishPosition(game) {
    this.redis.publish(
      game.get("uuid"),
      (await game.currentPosition()).get("m_fen")
    )
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
      users: parseInt(await this.users(), 10),
      games: await this.games.length()
    }
  }
}
