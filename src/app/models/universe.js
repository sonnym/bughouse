import { contains, isNil } from "ramda"

import List from "./list"
import Redis from "./redis"

import Lobby from "./lobby"
import Game from "./game"

import Revision from "./revision"
import Capture from "./capture"

import { PENDING } from "~/share/constants/results"
import { MOVE, DROP, RESIGN } from "~/share/constants/revision_types"

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
    this.capture = new Capture(this)

    if (opts.bind) {
      Game.on("create", this.handleGameCreationWrapper.bind(this))
      Revision.on("create", this.handleRevisionCreationWrapper.bind(this))
    }
  }

  async addSocket() {
    await this.redis.incr(USERS_KEY)
    await this.publish()
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
    process.nextTick(this.handleGameCreation.bind(this, game))
  }

  handleRevisionCreationWrapper(revision) {
    process.nextTick(this.handleRevisionCreation.bind(this, revision))
  }

  async handleGameCreation(game) {
    if (isNil(game)) {
      return
    }

    await this.games.push(game.get("uuid"))

    await game.serializePrepare()
    const serializedGame = game.serialize()

    await this.redis.publish(
      GAME_CREATION_CHANNEL,
      JSON.stringify(serializedGame)
    )

    await this.publish("test")
  }

  async handleRevisionCreation(revision) {
    await revision.refresh({ withRelated: ["game", "position"] })
    const type = revision.get("type")

    if (type === MOVE) {
      await this.processCapture(revision)
    }

    if (contains(type, [MOVE, DROP, RESIGN])) {
      await this.processResult(revision)
    }

    await this.publishRevision(revision)
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
    await this.redis.publish(
      UNIVERSE_CHANNEL,
      JSON.stringify(await this.serialize())
    )
  }

  async publishRevision(revision) {
    const serializedRevision = await revision.serialize()
    const uuid = serializedRevision.game.uuid

    await this.redis.publish(uuid, JSON.stringify(revision))
  }

  async processCapture(revision) {
    const move = revision.get("move")

    if (!move || !move.captured) {
      return
    }

    await this.capture.process(revision.related("game"), move.color, move.piece)
  }

  async processResult(revision) {
    const game = await revision.related("game")

    if (game.get("result") === PENDING) {
      return
    }

    this.games.remove(game.uuid)
  }
}
