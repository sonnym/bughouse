import List from "./list"
import Redis from "./redis"

import Lobby from "./lobby"
import Game from "./game"

import Revision from "./revision"
import Capture from "./capture"

import { POSITION, RESULT } from "~/share/constants/game_update_types"

const UNIVERSE_CHANNEL = "universe"
const GAME_CREATION_CHANNEL = "universe:game"
const USERS_KEY = "universe:users"

export { UNIVERSE_CHANNEL, GAME_CREATION_CHANNEL }

export default class Universe {
  constructor(opts = { bind: true }) {
    this.redis = new Redis()

    // TODO: restore state from redis
    this.redis.set(USERS_KEY, 0)

    this.lobby = new Lobby(Game)
    this.games = new List("games")

    if (opts.bind) {
      Game.on("create", this.handleGameCreation.bind(this))
    }
  }

  async addSocket() {
    await this.redis.incr(USERS_KEY)
    this.publish()
  }

  async removeSocket({ client }) {
    await this.redis.decr(USERS_KEY)

    // TODO: grace period
    if (client.gameUUID) {
      await Revision.forfeit(client.gameUUID, client.user)
      await this.games.remove(client.gameUUID)
    }

    await this.publish()
  }

  async play(user) {
    await this.lobby.push(user)
  }

  handleGameCreationWrapper(game) {
    process.nextTick(this.handleGameCreation.bind(this))
  }

  async handleGameCreation(game) {
    await this.games.push(game.get("uuid"))

    await game.serializePrepare()
    const serializedGame = game.serialize()

    await this.redis.publish(
      GAME_CREATION_CHANNEL,
      JSON.stringify(serializedGame)
    )

    await this.publish("test")
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

  async publish() {
    this.redis.publish(
      UNIVERSE_CHANNEL,
      JSON.stringify(await this.serialize())
    )
  }

  publishPosition(uuid, position) {
    this.redis.publish(uuid, JSON.stringify({
      type: POSITION,
      payload: position.serialize()
    }))
  }

  publishResult(uuid, result) {
    this.games.remove(uuid)

    this.redis.publish(uuid, JSON.stringify({
      type: RESULT,
      payload: result
    }))
  }

  async publishCapture(game, color, piece) {
    const { uuid, position } = await new Capture(this).process(game, color, piece)

    this.publishPosition(uuid, position)
  }
}
