import redis from "redis"

import { isTest } from "./../../share/environment"

import Game from "./game"
import Revision from "./revision"
import Universe from "./universe"

const REDIS_DB = isTest() ? 7 : 1

export default class Player {
  constructor(client) {
    this.client = client
  }

  get redisClient() {
    if (!this._redisClient) {
      this._redisClient = redis.createClient({ db: REDIS_DB })
    }

    return this._redisClient
  }

  async play() {
    const result = await Universe.match(this.client)

    if (result === false) {
      this.client.send({ action: "wait" })
      return
    }

    const { game, opponent } = result
    const gameData = await game.serialize()

    this.client.startGame(gameData)
    opponent.player.startGame(gameData)
  }

  async revision(data) {
    const game = await Game.where({ uuid: this.client.gameUUID }).fetch()
    await Revision.create(game, data)

    game.publishPosition()
  }

  startGame(data) {
    this.client.gameUUID = data.uuid

    this.redisClient.subscribe(data.uuid)
    this.client.send({ action: "start", game: data })
  }
}
