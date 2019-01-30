import Model, { transaction } from "./base"

import { REVISION_TYPES } from "~/share/constants"

import Redis from "./redis"

import User from "./user"
import Position from "./position"
import Revision from "./revision"

export default class Game extends Model {
  constructor(...args) {
    super(...args)
  }

  static get redis() {
    if (!this._redis) {
      this._redis = new Redis()
    }

    return this._redis
  }

  get tableName() {
    return "games"
  }

  get hasTimestamps() {
    return true
  }

  whiteUser() {
    return this.belongsTo(User, "white_user_id")
  }

  blackUser() {
    return this.belongsTo(User, "black_user_id")
  }

  revisions() {
    return this.hasMany(Revision)
  }

  positions() {
    return this.hasMany(Position).through(Revision, "id", "game_id")
  }

  static async create(whiteUser, blackUser) {
    const game = new Game({
      white_user_id: whiteUser.get("id"),
      black_user_id: blackUser.get("id")
    })

    const position = new Position()

    await transaction(async transacting => {
      await game.save(null, { transacting })
      await position.save(null, { transacting })

      await new Revision({
        type: REVISION_TYPES.START,
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id")
      }).save(null, { transacting })
    })

    game.publishPosition()

    return game
  }

  async publishPosition() {
    await this.refresh()

    Game.redis.publish(
      this.get("uuid"),
      (await this.currentPosition()).get("m_fen")
    )
  }

  async currentPosition() {
    return await this.positions().orderBy("created_at", "DESC").fetchOne()
  }

  async serialize() {
    const whiteUser = await this.whiteUser().refresh({ withRelated: ['profile'] })
    const blackUser = await this.blackUser().refresh({ withRelated: ['profile'] })

    const currentPosition = await this.currentPosition()

    return {
      uuid: this.get("uuid"),
      whiteUser: await whiteUser.serialize(),
      blackUser: await blackUser.serialize(),
      currentPosition: currentPosition.serialize()
    }
  }
}
