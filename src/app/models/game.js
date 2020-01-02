import Model, { transaction } from "./base"

import { BLACK, WHITE } from "~/share/constants/chess"
import { START } from "~/share/constants/revision_types"

import User from "./user"
import Position from "./position"
import Revision from "./revision"

export const RESULTS = {
  WHITE: "1-0",
  BLACK: "0-1",
  DRAW: "½-½"
}

export default class Game extends Model {
  constructor(...args) {
    super(...args)
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
    return this.belongsToMany(Position).through(Revision)
  }

  ascendingPositions() {
    return this.positions().orderBy("move_number", "ASC")
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
      .fetchAll()
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

    return game
  }

  async currentPosition() {
    return await this.positions().orderBy("move_number", "DESC").fetchOne()
  }

  async setResult(chess) {
    this.set("result", getResult(chess))
    await this.save()
  }

  async serializePrepare() {
    await this.refresh({
      withRelated: [
        "whiteUser",
        "blackUser",
        "whiteUser.profile",
        "blackUser.profile",
        "ascendingPositions"
      ]
    })
  }

  serialize() {
    return {
      uuid: this.get("uuid"),
      result: this.get("result"),
      positions: this.related("ascendingPositions").map(position => position.serialize()),
      players: [
        { color: WHITE, ...this.related("whiteUser").serialize() },
        { color: BLACK, ...this.related("blackUser").serialize() }
      ]
    }
  }
}

function getResult(chess) {
  if (chess.in_draw()) {
    return RESULTS.DRAW
  }

  if (chess.in_checkmate()) {
    switch (chess.turn()) {
      case "w": return RESULTS.BLACK
      case "b": return RESULTS.WHITE
    }
  }
}
