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

    this.redis.flushdb()
    this.redis.set(USERS_KEY, 0)

    this.lobby = new Lobby(Game)
    this.games = new List("games")

    Game.on("create", this.registerGame.bind(this))
    Game.on("revision", this.publishPosition.bind(this))
  }

  registerGame(game) {
    this.games.push(game.get("uuid"))
    this.redis.publish(UNIVERSE_CHANNEL, "")
  }

  play(player) {
    this.lobby.push(player)
  }

  async addSocket(socket) {
    await socket.redis.subscribeAsync(UNIVERSE_CHANNEL)

    this.redis.multi()
      .incr(USERS_KEY)
      .publish(UNIVERSE_CHANNEL, "")
      .exec()
  }

  removeSocket(socket) {
    socket.redis.end(true)

    this.redis.multi()
      .decr(USERS_KEY)
      .publish(UNIVERSE_CHANNEL, "")
      .exec()

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
      games: await this.games.length()
    }
  }

  async publishPosition(game) {
    this.redis.publish(
      game.get("uuid"),
      (await game.currentPosition()).get("m_fen")
    )
  }
}
