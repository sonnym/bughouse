import { isNil } from "ramda"

import { isDevelopment } from "~/share/environment"

import List from "./list"
import Redis from "./redis"

import Lobby from "./lobby"
import Game from "./game"

import Revision from "./revision"
import Capture from "./capture"

import { WHITE, BLACK } from "~/share/constants/chess"
import { POSITION, RESULT } from "~/share/constants/game_update_types"

const UNIVERSE_CHANNEL = "universe"
const USERS_KEY = "universe:users"

export { UNIVERSE_CHANNEL }

export default class Universe {
  constructor() {
    this.redis = new Redis()

    // TODO: restore state from redis
    if (isDevelopment()) {
      this.redis.flushdb()
    }
    this.redis.set(USERS_KEY, 0)

    this.lobby = new Lobby(Game)
    this.games = new List("games")
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

  async registerClient(client) {
    const { game, whiteClient, blackClient } = await this.lobby.push(client)

    if (isNil(game)) {
      return
    }

    await this.games.push(game.get("uuid"))

    await game.serializePrepare()
    const serializedGame = game.serialize()

    whiteClient.startGame(serializedGame, WHITE)
    blackClient.startGame(serializedGame, BLACK)

    // TODO: publish universe
    // TODO: update subscription for subscribed to tail
  }

  async nextGame(uuid) {
    const next = await this.games.next(uuid)

    return next ? next : await this.games.head()
  }

  async prevGame(uuid) {
    const prev = await this.games.prev(uuid)

    return prev ? prev : await this.games.tail()
  }

  async users() {
    return await this.redis.get(USERS_KEY)
  }

  async serialize() {
    return {
      users: parseInt(await this.users(), 10),
      games: parseInt(await this.games.length(), 10)
    }
  }

  publishPosition(uuid, position) {
    this.redis.publish(uuid, JSON.stringify({
      type: POSITION,
      payload: position.serialize()
    }))
  }

  publishResult(uuid, result) {
    // TODO: remove from list

    this.redis.publish(uuid, JSON.stringify({
      type: RESULT,
      payload: result
    }))
  }

  async publishCapture(game, piece) {
    const { uuid, revision } = await new Capture(this, Revision).process(game, piece)

    this.publishPosition(uuid, { position: revision.related("position") })
  }
}
