import EventEmitter from "events"

import Model, { transaction } from "./base"

import { BLACK, WHITE } from "~/share/chess"
import { START } from "~/share/constants/revision_types"

import User from "./user"
import Position from "./position"
import Revision from "./revision"

const emitter = new EventEmitter()

export default class Game extends Model {
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
    return this.hasMany(Revision).orderBy("created_at", "ASC")
  }

  positions() {
    return this.belongsToMany(Position).through(Revision)
  }

  ascendingPositions() {
    return this.positions().orderBy("move_number", "ASC")
  }

  currentPosition() {
    return this.hasOne(Position)
      .through(Revision, "id", "game_id", "position_id")
      .orderBy("move_number", "DESC")
      .query(qb => qb.limit(1))
  }

  static on(eventName, callback) {
    emitter.on(eventName, callback)
  }

  static get serializeRelated() {
    return [
      "whiteUser",
      "blackUser",

      "whiteUser.profile",
      "blackUser.profile",

      "whiteUser.rating",
      "blackUser.rating",

      "currentPosition"
    ]
  }

  static async forUser(uuid) {
    return await Game
      .query(builder => {
        builder.innerJoin("users", function() {
          this.on("users.id", "=", "games.white_user_id").orOn("users.id", "=", "games.black_user_id")
        })

        builder.where("users.uuid", "=", uuid)
      })
      .orderBy("-created_at")
      .fetchAll({
        withRelated: this.constructor.serializeRelated
      })
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
        type: START,
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id")
      }).save(null, { transacting })
    })

    emitter.emit("create", game)

    return game
  }

  async serializePrepare() {
    await this.refresh({
      withRelated: this.constructor.serializeRelated
    })
  }

  serialize() {
    return {
      uuid: this.get("uuid"),
      result: this.get("result"),
      currentPosition: this.related("currentPosition").serialize(),
      players: [
        { color: WHITE, ...this.related("whiteUser").serialize() },
        { color: BLACK, ...this.related("blackUser").serialize() }
      ]
    }
  }
}
